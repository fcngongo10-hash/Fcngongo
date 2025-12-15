import React from 'react';
import { Calendar, CheckCircle2, Map } from 'lucide-react';

export const PlanningModule = () => {
  const steps = [
    { year: '2023', title: 'Controle Financeiro', status: 'completed', desc: 'Sair das dívidas e organizar orçamento.' },
    { year: '2024', title: 'Reserva de Emergência', status: 'current', desc: 'Juntar 6 meses de custo de vida.' },
    { year: '2025', title: 'Início dos Investimentos', status: 'upcoming', desc: 'Começar carteira de ações e renda fixa.' },
    { year: '2030', title: 'Casa Própria', status: 'upcoming', desc: 'Entrada de 30% no imóvel dos sonhos.' },
    { year: '2045', title: 'Liberdade Financeira', status: 'upcoming', desc: 'Viver de renda passiva.' },
  ];

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-2xl font-bold text-slate-800">Planeamento Futuro</h2>
          <p className="text-slate-500 text-sm">Módulo 5: Proteção e Longo Prazo</p>
       </div>

       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-10 py-2">
             {steps.map((step, idx) => (
               <div key={idx} className="relative pl-8">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                    step.status === 'completed' ? 'bg-emerald-500 border-emerald-500' :
                    step.status === 'current' ? 'bg-white border-blue-500 animate-pulse' :
                    'bg-slate-100 border-slate-300'
                  }`}></div>
                  
                  <div className={`p-4 rounded-xl border ${step.status === 'current' ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent'}`}>
                     <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-bold ${step.status === 'current' ? 'text-blue-600' : 'text-slate-500'}`}>{step.year}</span>
                        {step.status === 'completed' && <CheckCircle2 size={16} className="text-emerald-500" />}
                     </div>
                     <h3 className="font-bold text-slate-800">{step.title}</h3>
                     <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
                  </div>
               </div>
             ))}
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
             <h3 className="font-bold text-indigo-900 mb-2">Proteção (Seguros)</h3>
             <p className="text-sm text-indigo-700 mb-4">Lembre-se: O seguro de saúde protege seu patrimônio contra gastos inesperados.</p>
             <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Adicionar Apólice</button>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
             <h3 className="font-bold text-emerald-900 mb-2">Testamento & Legado</h3>
             <p className="text-sm text-emerald-700 mb-4">Planeje como seus bens serão distribuídos para garantir a paz familiar.</p>
             <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Ver Guia</button>
          </div>
       </div>
    </div>
  );
};