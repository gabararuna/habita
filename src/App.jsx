import { useState } from 'react';
import CalculatorForm from './components/CalculatorForm';
import ResultsDashboard from './components/ResultsDashboard';
import EvolutionTable from './components/EvolutionTable';
import { runSimulation } from './lib/calculator';

function App() {
  const [results, setResults] = useState(null);

  const handleCalculate = (inputs) => {
    const simulationData = runSimulation(inputs);

    setResults({
      inputs,
      financing: simulationData.financing,
      renting: simulationData.renting
    });

    setTimeout(() => {
      window.scrollBy({ top: 700, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="orb-container opacity-30"></div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full relative z-10 px-4 pt-12 pb-32">
        <header className="text-center mb-12 relative z-20">
          <a filter="brightness(1.2)" href="https://www.gruponumera.com/" target="_blank" rel="noopener noreferrer" className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#00bfa5] text-[10px] sm:text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:bg-white/10 hover:border-[#00bfa5]/40 hover:shadow-[0_0_20px_rgba(0,191,165,0.25)] hover:-translate-y-0.5 active:scale-95 cursor-pointer">
            Desenvolvido por Numera
          </a>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light mb-4 tracking-tight leading-tight">
            Alugar vs <span className="shimmer-text font-medium">Financiar</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Descubra a melhor decisão financeira para o seu perfil avaliando a paridade real de custos mês a mês.
          </p>
        </header>

        <main className="relative z-20 max-w-5xl mx-auto">
          <CalculatorForm onCalculate={handleCalculate} />
          {results && (
            <>
              <ResultsDashboard results={results} />
              <EvolutionTable results={results} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
