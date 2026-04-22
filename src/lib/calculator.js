export function runSimulation(inputs) {
  const {
    propertyValue,
    rentValue,
    condoValue = 0,
    condoIncluded = false,
    downPayment,
    additionalCosts,
    annualAppreciation,
    annualInflation,
    termMonths,
    annualInterestRate,
    annualInvestmentRate,
    method
  } = inputs;

  const n = termMonths;
  const financingRateM = Math.pow(1 + annualInterestRate, 1 / 12) - 1;
  const investmentRateM = Math.pow(1 + annualInvestmentRate, 1 / 12) - 1;
  const appreciationRateM = Math.pow(1 + annualAppreciation, 1 / 12) - 1;
  
  const principalToFinance = propertyValue - downPayment;
  const totalUpfrontCosts = downPayment + additionalCosts;
  
  let currentRent = rentValue;
  let currentPropertyValue = propertyValue;
  
  // State for Financing Scenario
  let finBalance = principalToFinance;
  let finInvestment = 0;
  let finTotalPaid = 0;
  let monthlyFinancingList = [];
  
  // State for Renting Scenario
  let rentInvestment = totalUpfrontCosts; // Initial investment (Entrada + ITBI que sobraram)
  let rentTotalPaid = 0;
  let monthlyRentList = [];

  for (let month = 1; month <= n; month++) {
    // 1. Calculate Financing PMT for this month
    let pmt, interest, amort;
    if (method === 'PRICE') {
      pmt = principalToFinance * (financingRateM / (1 - Math.pow(1 + financingRateM, -n)));
      interest = finBalance * financingRateM;
      amort = pmt - interest;
    } else { // SAC
      amort = principalToFinance / n;
      interest = finBalance * financingRateM;
      pmt = amort + interest;
    }
    finBalance -= amort;
    if (finBalance < 0) finBalance = 0;
    
    // 2. Yields on Investments
    const prevFinInv = finInvestment;
    finInvestment = finInvestment * (1 + investmentRateM);
    const finStepYield = finInvestment - prevFinInv;

    const prevRentInv = rentInvestment;
    rentInvestment = rentInvestment * (1 + investmentRateM);
    const rentStepYield = rentInvestment - prevRentInv;

    // 3. Compare Outlays and Invest the Difference
    // Financing always pays parcela + condo; renting pays rent (which may already include condo)
    const effectiveFin = pmt + condoValue;
    const effectiveRent = condoIncluded ? currentRent : currentRent + condoValue;

    let finAporte = 0;
    let rentAporte = 0;

    if (effectiveFin > effectiveRent) {
      rentAporte = effectiveFin - effectiveRent;
      rentInvestment += rentAporte;
    } else if (effectiveRent > effectiveFin) {
      finAporte = effectiveRent - effectiveFin;
      finInvestment += finAporte;
    }

    // Accumulate costs
    finTotalPaid += effectiveFin;
    rentTotalPaid += effectiveRent;

    // Property Appreciation
    currentPropertyValue = currentPropertyValue * (1 + appreciationRateM);

    // Save monthly snapshot
    monthlyFinancingList.push({
      month,
      baseHousingCost: pmt,
      condoCost: condoValue,
      housingCost: effectiveFin,
      interestToBank: interest,
      debtBalance: finBalance,
      initialAccountBalance: prevFinInv,
      aporte: finAporte,
      yield: finStepYield,
      finalAccountBalance: finInvestment,
      propertyValue: currentPropertyValue,
      totalPatrimony: currentPropertyValue + finInvestment - finBalance
    });

    monthlyRentList.push({
      month,
      baseHousingCost: currentRent,
      condoCost: condoIncluded ? 0 : condoValue,
      housingCost: effectiveRent,
      interestToBank: 0,
      debtBalance: 0,
      initialAccountBalance: prevRentInv,
      aporte: rentAporte,
      yield: rentStepYield,
      finalAccountBalance: rentInvestment,
      propertyValue: 0,
      totalPatrimony: rentInvestment
    });

    // Adjust Rent Annually
    if (month % 12 === 0) {
      currentRent = currentRent * (1 + annualInflation);
    }
  }

  return {
    financing: {
      totalPaid: finTotalPaid,
      finalInvestedBalance: finInvestment,
      finalPropertyValue: currentPropertyValue,
      monthlyList: monthlyFinancingList
    },
    renting: {
      totalRentPaid: rentTotalPaid,
      finalInvestedBalance: rentInvestment,
      monthlyList: monthlyRentList
    }
  };
}
