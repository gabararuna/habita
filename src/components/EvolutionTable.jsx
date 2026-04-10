import { useState } from 'react';

export default function EvolutionTable({ results }) {
  if (!results) return null;

  const [activeTab, setActiveTab] = useState('rent'); // 'buy' or 'rent'

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const monthlyFinancing = results.financing.monthlyList;
  const monthlyRent = results.renting.monthlyList;

  const currentData = activeTab === 'rent' ? monthlyRent : monthlyFinancing;

  return (
    <div className="mt-12 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-light text-white tracking-tight">Evolução Analítica</h3>
          <p className="text-gray-400 text-sm mt-1 font-light">Evolução mês a mês cobrindo todos os fluxos do seu patrimônio</p>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 rounded-lg p-1 mt-6 md:mt-0">
          <button 
            onClick={() => setActiveTab('rent')}
            className={`px-6 py-2 rounded-md text-sm transition-all ${activeTab === 'rent' ? 'bg-[#00bfa5]/20 text-[#00bfa5] font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Tabela de Aluguel
          </button>
          <button 
            onClick={() => setActiveTab('buy')}
            className={`px-6 py-2 rounded-md text-sm transition-all ${activeTab === 'buy' ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Tabela de Financiamento
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto max-h-[600px] relative">
          <table className="w-full text-left text-sm text-gray-400 relative">
            <thead className="text-xs uppercase bg-black/60 text-gray-300 sticky top-0 z-20 backdrop-blur-xl">
              <tr>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Mês</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">{activeTab === 'rent' ? 'Aluguel Pago' : 'Parcela Paga'}</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Juros ao Banco</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Dívida Restante</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Saldo Inicial Conta</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Aporte Mês</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Lucro Rendimento</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Total na Conta</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Valor do Imóvel</th>
                <th className="px-6 py-4 font-medium text-white whitespace-nowrap">Patrimônio Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-gray-300 font-medium">{row.month}</td>
                  <td className="px-6 py-4 text-red-400/80">{formatCurrency(row.housingCost)}</td>
                  <td className="px-6 py-4">{formatCurrency(row.interestToBank)}</td>
                  <td className="px-6 py-4">{formatCurrency(row.debtBalance)}</td>
                  
                  <td className="px-6 py-4">{formatCurrency(row.initialAccountBalance)}</td>
                  <td className="px-6 py-4 text-gray-300">+{formatCurrency(row.aporte)}</td>
                  <td className="px-6 py-4 text-yellow-400/80">+{formatCurrency(row.yield)}</td>
                  <td className={`px-6 py-4 ${activeTab === 'rent' ? 'text-[#00bfa5]' : 'text-blue-400'}`}>
                    {formatCurrency(row.finalAccountBalance)}
                  </td>
                  
                  <td className="px-6 py-4 text-gray-300">{formatCurrency(row.propertyValue)}</td>
                  <td className="px-6 py-4 font-medium text-white">{formatCurrency(row.totalPatrimony)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
