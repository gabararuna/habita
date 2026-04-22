import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

export default function CalculatorForm({ onCalculate }) {
  const [method, setMethod] = useState('SAC');
  const [propertyValue, setPropertyValue] = useState(400000);
  const [rentValue, setRentValue] = useState(2000); // 0.5% default of 400.000
  const [condoValue, setCondoValue] = useState(0);
  const [condoIncluded, setCondoIncluded] = useState(false);
  const [downPayment, setDownPayment] = useState(80000);
  const [additionalCosts, setAdditionalCosts] = useState(16000); // 4% default of 400.000

  const [annualAppreciation, setAnnualAppreciation] = useState(6.04); // FipeZAP Média 5 Anos
  const [annualInflation, setAnnualInflation] = useState(5.11); // IGP-M Média 5 Anos
  const [annualInterestRate, setAnnualInterestRate] = useState(10.50); // Financiamento Média 5 Anos
  const [annualInvestmentRate, setAnnualInvestmentRate] = useState(12.35); // Selic Média 5 Anos

  const [termMonths, setTermMonths] = useState(420);

  const handlePropertyChange = (value) => {
    const numericValue = value ? Number(value) : 0;
    setPropertyValue(numericValue);
    setRentValue(numericValue * 0.005);
    setAdditionalCosts(numericValue * 0.05);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({
      method,
      propertyValue: Number(propertyValue),
      rentValue: Number(rentValue),
      condoValue: Number(condoValue),
      condoIncluded,
      additionalCosts: Number(additionalCosts),
      annualAppreciation: Number(annualAppreciation) / 100,
      annualInflation: Number(annualInflation) / 100,
      downPayment: Number(downPayment),
      termMonths: Number(termMonths),
      annualInterestRate: Number(annualInterestRate) / 100,
      annualInvestmentRate: Number(annualInvestmentRate) / 100,
    });
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white font-light focus:outline-none focus:border-[#00bfa5]/40 transition-colors mt-1.5 focus:bg-white/10";
  const labelClass = "text-xs text-gray-400 font-light flex items-center justify-between tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

        {/* Coluna Esquerda — Imóvel & Aluguel */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-light text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00bfa5]"></span>
            Dados do Imóvel & Aluguel
          </h3>

          <div>
            <label className={labelClass}>Valor do Imóvel à Vista (R$)</label>
            <CurrencyInput
              id="propertyValue"
              name="propertyValue"
              placeholder="R$ 400.000"
              value={propertyValue}
              decimalsLimit={0}
              prefix="R$ "
              groupSeparator="."
              decimalSeparator=","
              onValueChange={handlePropertyChange}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                <span>Aluguel Mensal (R$)</span>
                <span className="text-[10px] text-[#00bfa5]/70" title="Auto-calculado usando 0.5%">0,5% Valor.Imv</span>
              </label>
              <CurrencyInput
                id="rentValue"
                name="rentValue"
                placeholder="R$ 2.000"
                value={rentValue}
                decimalsLimit={0}
                prefix="R$ "
                groupSeparator="."
                decimalSeparator=","
                onValueChange={(value) => setRentValue(value || 0)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                <span>Condomínio Mensal (R$)</span>
              </label>
              <CurrencyInput
                id="condoValue"
                name="condoValue"
                placeholder="R$ 0"
                value={condoValue}
                decimalsLimit={0}
                prefix="R$ "
                groupSeparator="."
                decimalSeparator=","
                onValueChange={(value) => setCondoValue(value || 0)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Toggle switch moderno */}
          <button
            type="button"
            role="switch"
            aria-checked={condoIncluded}
            onClick={() => setCondoIncluded(!condoIncluded)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors cursor-pointer group"
          >
            <span className="text-xs text-gray-400 font-light select-none group-hover:text-gray-300 transition-colors">
              Condomínio já incluso no aluguel
            </span>
            <div className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${condoIncluded ? 'bg-[#00bfa5]/70' : 'bg-white/15'}`}>
              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${condoIncluded ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
            </div>
          </button>

          <div>
            <label className={labelClass}>
              <span>Valorização (%)</span>
              <span className="text-[10px] text-[#00bfa5]/70" title="Índice FipeZAP Média 5 Anos">FipeZAP 5A</span>
            </label>
            <input type="number" step="0.01" className={inputClass} value={annualAppreciation} onChange={e => setAnnualAppreciation(e.target.value)} />
          </div>

          <div>
            <label className={labelClass}>
              <span>Inflação/Ano (%)</span>
              <span className="text-[10px] text-[#00bfa5]/70" title="IGP-M Média 5 Anos (5.11%)">IGP-M 5A</span>
            </label>
            <input type="number" step="0.01" className={inputClass} value={annualInflation} onChange={e => setAnnualInflation(e.target.value)} />
          </div>
        </div>

        {/* Coluna Direita — Financiamento & Investimento */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-light text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Financiamento & Investimento
          </h3>

          {/* Toggle SAC / PRICE movido para dentro da seção */}
          <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-lg border border-white/5">
            <button
              type="button"
              onClick={() => setMethod('SAC')}
              className={`flex-1 py-2 rounded-md text-sm transition-all ${method === 'SAC' ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-gray-400 font-light hover:text-white hover:bg-white/5'}`}
            >
              Amortização SAC
            </button>
            <button
              type="button"
              onClick={() => setMethod('PRICE')}
              className={`flex-1 py-2 rounded-md text-sm transition-all ${method === 'PRICE' ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-gray-400 font-light hover:text-white hover:bg-white/5'}`}
            >
              Tabela PRICE
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Entrada Direta (R$)</label>
              <CurrencyInput
                id="downPayment"
                name="downPayment"
                placeholder="R$ 80.000"
                value={downPayment}
                decimalsLimit={0}
                prefix="R$ "
                groupSeparator="."
                decimalSeparator=","
                onValueChange={(value) => setDownPayment(value || 0)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                <span>Custos Extras (R$)</span>
                <span className="text-[10px] text-blue-400/80" title="ITBI, Cartório, Corretor (~4%)">Auto: 4%</span>
              </label>
              <CurrencyInput
                id="additionalCosts"
                name="additionalCosts"
                placeholder="R$ 20.000"
                value={additionalCosts}
                decimalsLimit={0}
                prefix="R$ "
                groupSeparator="."
                decimalSeparator=","
                onValueChange={(value) => setAdditionalCosts(value || 0)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Prazo (Meses)</label>
            <input type="number" className={inputClass} value={termMonths} onChange={e => setTermMonths(e.target.value)} />
          </div>

          <div>
            <label className={labelClass}>
              <span>Taxa Financiamento (% a.a.)</span>
              <span className="text-[10px] text-blue-400/80" title="Média SBPE Últimos 5 Anos">Mercado 5A</span>
            </label>
            <input type="number" step="0.01" className={inputClass} value={annualInterestRate} onChange={e => setAnnualInterestRate(e.target.value)} />
          </div>

          <div>
            <label className={labelClass}>
              <span>Rendimento Carteira (% a.a.)</span>
              <span className="text-[10px] text-blue-400/80" title="Selic / CDI Média 5 Anos">Selic 5A</span>
            </label>
            <input type="number" step="0.01" className={inputClass} value={annualInvestmentRate} onChange={e => setAnnualInvestmentRate(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
        <button type="submit" className="glass-btn text-sm font-medium w-full md:w-auto px-8 py-2.5">
          Simular Cenários
        </button>
      </div>
    </form>
  )
}
