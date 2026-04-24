import { TrendingUp, Home, CheckCircle2 } from 'lucide-react';

export default function ResultsDashboard({ results }) {
  if (!results) return null;

  const { financing, renting, inputs } = results;

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Math.abs(val));

  const rentFinalWealth = renting.finalInvestedBalance;
  // Final wealth for buyer includes the clean property + any investments made during months rent was more expensive.
  const buyFinalWealth = financing.finalPropertyValue + financing.finalInvestedBalance;
  
  const isRentBetter = rentFinalWealth > buyFinalWealth;
  
  const totalRentAportes = renting.monthlyList.reduce((acc, curr) => acc + curr.aporte, 0);
  const totalFinAportes = financing.monthlyList.reduce((acc, curr) => acc + curr.aporte, 0);

  const totalRentYield = renting.monthlyList.reduce((acc, curr) => acc + curr.yield, 0);
  const totalFinYield = financing.monthlyList.reduce((acc, curr) => acc + curr.yield, 0);
  
  const upfrontCapital = inputs.downPayment + (inputs.additionalCosts || 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-10">
      
      {/* Resumo do vencedor */}
      <div className={`p-6 rounded-2xl border backdrop-blur-md shadow-2xl ${isRentBetter ? 'bg-[#00bfa5]/5 border-[#00bfa5]/20' : 'bg-white/5 border-white/15'}`}>
        <div className="flex items-start md:items-center flex-col md:flex-row gap-5">
          <div className={`p-3 rounded-full ${isRentBetter ? 'bg-[#00bfa5]/10' : 'bg-white/5'}`}>
            <CheckCircle2 className={`w-8 h-8 ${isRentBetter ? 'text-[#00bfa5]' : 'text-white/80'} shrink-0`} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-light tracking-tight text-white mb-1">
              {isRentBetter ? "Alugar e Investir a diferença é mais vantajoso" : "Comprar Financiado é mais vantajoso"}
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-light">
              No final de <strong className="text-gray-200 font-medium">{inputs.termMonths} meses</strong> ({(inputs.termMonths/12).toFixed(0)} anos), a diferença de patrimônio líquido será de <span className="font-medium text-white">{formatCurrency(Math.abs(rentFinalWealth - buyFinalWealth))}</span> em favor da opção campeã.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Alugar */}
        <div className={`bg-white/5 backdrop-blur-xl p-8 rounded-2xl relative overflow-hidden group border ${isRentBetter ? 'border-[#00bfa5]/40 shadow-[0_0_20px_rgba(0,191,165,0.1)]' : 'border-white/5'}`}>
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-40 h-40 text-[#00bfa5]" strokeWidth={1} />
          </div>
          <h3 className="text-xl font-light text-gray-200 mb-8 flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isRentBetter ? 'animate-pulse bg-[#00bfa5]' : 'bg-[#00bfa5]/40'}`}></div>
            <span className="text-[#00bfa5]">Cenário: Alugar</span>
          </h3>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mb-2">Patrimônio Líquido Final</p>
              <p className="text-3xl md:text-4xl font-light text-white tracking-tight">{formatCurrency(rentFinalWealth)}</p>
            </div>
            
            <div className="pt-6 border-t border-white/5 space-y-3 relative z-10">
              <div className="flex justify-between py-1 border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-light" title="Entrada + Custos mantidos e investidos (+)">Capital Inicial na Conta (+)</span>
                <span className="font-medium text-white text-sm text-right">+ {formatCurrency(upfrontCapital)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-light" title="Soma dos trocos mensais enquanto parcela > aluguel">Aportes Realizados (+)</span>
                <span className="font-medium text-white text-sm text-right">+ {formatCurrency(totalRentAportes)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-light" title="Puro rendimento de Juros Compostos ao longo dos anos">Rendimentos Acumulados (+)</span>
                <span className="font-medium text-white text-sm text-right">+ {formatCurrency(totalRentYield)}</span>
              </div>
              
              <div className="flex justify-between py-1 border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-light" title="Saldo líquido (Capital + Aportes + Rendimentos)">Saldo em Dinheiro (+)</span>
                <span className="font-medium text-white text-sm text-right">{formatCurrency(rentFinalWealth)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-light">Valor em Bens (+)</span>
                <span className="font-medium text-white text-sm text-right">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 pb-2">
                <span className="text-white text-sm font-bold" title="Soma total do seu império (Dinheiro + Imóvel)">Patrimônio Total (=)</span>
                <span className="font-bold text-[#00bfa5] text-sm text-right">{formatCurrency(rentFinalWealth)}</span>
              </div>
              
              {/* O Desembolso é apenas comparativo */}
              <div className="flex justify-between py-1">
                <span className="text-gray-400 text-sm font-light" title="Total afundado sem retorno (Sunk Cost - Ignorado na soma da conta)">Desembolso p/ Moradia (-)</span>
                <span className="font-medium text-red-500 text-sm text-right">- {formatCurrency(renting.totalRentPaid)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Comprar */}
        <div className={`bg-white/5 backdrop-blur-xl p-8 rounded-2xl relative overflow-hidden group border ${!isRentBetter ? 'border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'border-white/5'}`}>
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Home className="w-40 h-40 text-white/80" strokeWidth={1} />
          </div>
          <h3 className="text-xl font-light text-gray-200 mb-8 flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${!isRentBetter ? 'bg-white/30' : 'bg-white/30'}`}></div>
            <span className="text-white/70">Cenário: Financiar</span>
          </h3>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mb-2">Patrimônio Líquido Final</p>
              <p className="text-3xl md:text-4xl font-light text-white tracking-tight">{formatCurrency(buyFinalWealth)}</p>
            </div>
            
            <div className="pt-6 border-t border-white/5 space-y-3 relative z-10">
              <div className="flex justify-between py-1 border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-light" title="Entrada + ITBI pagos para adquirir o bem (-)">Capital Desembolsado (-)</span>
                <span className="font-medium text-red-500 text-sm text-right">- {formatCurrency(upfrontCapital)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-light" title="Soma dos trocos mensais quando aluguel ultrapassa a parcela">Aportes Realizados (+)</span>
                <span className="font-medium text-white text-sm text-right">+ {formatCurrency(totalFinAportes)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-light" title="Puro rendimento de Juros Compostos sobre os aportes tardios">Rendimentos Acumulados (+)</span>
                <span className="font-medium text-white text-sm text-right">+ {formatCurrency(totalFinYield)}</span>
              </div>
              
              <div className="flex justify-between py-1 border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-light" title="Saldo líquido (Aportes + Rendimentos)">Saldo em Dinheiro (+)</span>
                <span className="font-medium text-white text-sm text-right">{formatCurrency(financing.finalInvestedBalance)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm font-light">Valor em Bens (+)</span>
                <span className="font-medium text-white text-sm text-right">{formatCurrency(financing.finalPropertyValue)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 pb-2">
                <span className="text-white text-sm font-bold" title="Soma total do seu império (Dinheiro + Imóvel)">Patrimônio Total (=)</span>
                <span className="font-bold text-white/70 text-sm text-right">{formatCurrency(buyFinalWealth)}</span>
              </div>

              {/* O Desembolso é apenas comparativo */}
              <div className="flex justify-between py-1">
                <span className="text-gray-400 text-sm font-light" title="Total afundado nas parcelas/juros (Sunk Cost)">Desembolso p/ Moradia (-)</span>
                <span className="font-medium text-red-500 text-sm text-right">- {formatCurrency(financing.totalPaid)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
