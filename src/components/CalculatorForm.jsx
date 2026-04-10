import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';

export default function CalculatorForm({ onCalculate }) {
  const [method, setMethod] = useState('SAC');
  const [propertyValue, setPropertyValue] = useState(400000);
  const [rentValue, setRentValue] = useState(2000); // 0.5% default of 400.000
  const [downPayment, setDownPayment] = useState(80000);
  const [additionalCosts, setAdditionalCosts] = useState(20000); // 5% default of 400.000
  
  const [annualAppreciation, setAnnualAppreciation] = useState(6.04); // FipeZAP Média 5 Anos
  const [annualInflation, setAnnualInflation] = useState(5.11); // IGP-M Média 5 Anos
  const [annualInterestRate, setAnnualInterestRate] = useState(10.50); // Financiamento Média 5 Anos
  const [annualInvestmentRate, setAnnualInvestmentRate] = useState(12.35); // Selic Média 5 Anos
  
  const [termMonths, setTermMonths] = useState(360);

  const handlePropertyChange = (value) => {
    const numericValue = value ? Number(value) : 0;
    setPropertyValue(numericValue);
    
    // Auto-preenchimento
    setRentValue(numericValue * 0.005); // Aluguel: 0.5%
    setAdditionalCosts(numericValue * 0.05); // Custos Adicionais: 5%
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({
      method,
      propertyValue: Number(propertyValue),
      rentValue: Number(rentValue),
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
      <div className="flex items-center justify-between mb-8 gap-3 bg-black/30 p-1.5 rounded-lg border border-white/5">
        <button 
          type="button" 
          onClick={() => setMethod('SAC')}
          className={`flex-1 py-2 rounded-md text-sm transition-all ${method === 'SAC' ? 'bg-[#00bfa5]/20 text-[#00bfa5] font-medium' : 'text-gray-400 font-light hover:text-white hover:bg-white/5'}`}
        >
          Amortização SAC
        </button>
        <button 
          type="button" 
          onClick={() => setMethod('PRICE')}
          className={`flex-1 py-2 rounded-md text-sm transition-all ${method === 'PRICE' ? 'bg-[#00bfa5]/20 text-[#00bfa5] font-medium' : 'text-gray-400 font-light hover:text-white hover:bg-white/5'}`}
        >
          Tabela PRICE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Info do Imóvel */}
        <div className="space-y-4">
          <h3 className="text-lg font-light text-white mb-5 border-b border-white/10 pb-3 flex items-center gap-2">
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
          <div>
            <label className={labelClass}>
              <span>Valor do Aluguel Mensal (R$)</span>
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

        {/* Info de Financiamento */}
        <div className="space-y-4">
          <h3 className="text-lg font-light text-white mb-5 border-b border-white/10 pb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Financiamento & Investimento
          </h3>
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
                <span className="text-[10px] text-blue-400/80" title="ITBI, Cartório, Corretor (~5%)">Auto: 5%</span>
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
