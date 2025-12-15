import React, { useState, useEffect } from 'react';
import { Target, Shield, TrendingUp, Calculator } from 'lucide-react';
import { Goal, Investment } from '../../types';
import { formatCurrency } from '../../constants';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface SavingsInvestProps {
  goals: Goal[];
  investments: Investment[];
}

export const SavingsInvestModule: React.FC<SavingsInvestProps> = ({ goals, investments }) => {
  const [activeTab, setActiveTab] = useState<'savings' | 'invest'>('savings');
  
  // Emergency Fund Logic
  const emergencyGoal = goals.find(g => g.type === 'Reserva');
  const otherGoals = goals.filter(g => g.type !== 'Reserva');
  
  // Investment Simulator State
  const [initialInvest, setInitialInvest] = useState(50000);
  const [monthlyInvest, setMonthlyInvest] = useState(10000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(12); // Angola typical rate
  const [simData, setSimData] = useState<any[]>([]);

  useEffect(() => {
    // Simple compound interest calculation
    const data = [];
    let current = initialInvest;
    for (let i = 0; i <= years; i++) {
      data.push({
        year: `Ano ${i}`,
        amount: Math.round(current)
      });
      // Add monthly contributions + interest
      for (let m = 0; m < 12; m++) {
        current += monthlyInvest;
        current += current * ((rate / 100) / 12);
      }
    }
    setSimData(data);
  }, [initialInvest, monthlyInvest, years, rate]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('savings')}
          className={`pb-3 px-4 text-sm font-bold transition-colors ${activeTab === 'savings' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-400'}`}
        >
          3. Reserva & Metas
        </button>
        <button 
           onClick={() => setActiveTab('invest')}
           className={`pb-3 px-4 text-sm font-bold transition-colors ${activeTab === 'invest' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
        >
          4. Investimentos
        </button>
      </div>

      {activeTab === 'savings' ? (
        <div className="space-y-6 animate-fade-in">
           {/* Emergency Fund Hero */}
           <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                   <Shield className="text-emerald-200" />
                   <h3 className="text-lg font-bold">Reserva de Emergência</h3>
                </div>
                <h2 className="text-4xl font-bold mb-1">{formatCurrency(emergencyGoal?.currentAmount || 0)}</h2>
                <p className="opacity-80 text-sm mb-6">Meta: {formatCurrency(emergencyGoal?.targetAmount || 0)} (6 meses de despesas)</p>
                
                <div className="w-full bg-emerald-900/30 rounded-full h-2 mb-2">
                  <div 
                    className="bg-emerald-300 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(((emergencyGoal?.currentAmount || 0) / (emergencyGoal?.targetAmount || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs opacity-75 italic">"Quem não tem reserva, vive em risco financeiro."</p>
              </div>
              <Shield size={120} className="absolute -bottom-6 -right-6 text-white opacity-10" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherGoals.map(goal => (
                <div key={goal.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                   <div className="flex justify-between items-start mb-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Target size={20} />
                      </div>
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {goal.deadline}
                      </span>
                   </div>
                   <h4 className="font-bold text-slate-800">{goal.title}</h4>
                   <p className="text-slate-500 text-xs mb-3">Falta {formatCurrency(goal.targetAmount - goal.currentAmount)}</p>
                   <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                         className="bg-blue-500 h-2 rounded-full"
                         style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                      ></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                   <Calculator className="text-indigo-600" />
                   <h3 className="font-bold text-slate-800">Simulador de Juros Compostos</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                   <div>
                     <label className="text-xs font-bold text-slate-500">Investimento Inicial</label>
                     <input type="number" value={initialInvest} onChange={e => setInitialInvest(Number(e.target.value))} className="w-full p-2 border rounded-lg text-sm mt-1" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500">Aporte Mensal</label>
                     <input type="number" value={monthlyInvest} onChange={e => setMonthlyInvest(Number(e.target.value))} className="w-full p-2 border rounded-lg text-sm mt-1" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500">Taxa Anual (%)</label>
                     <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full p-2 border rounded-lg text-sm mt-1" />
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500">Período (Anos)</label>
                     <input type="range" min="1" max="30" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full mt-3 accent-indigo-600" />
                     <span className="text-xs text-indigo-600 font-bold block text-right">{years} Anos</span>
                   </div>
                </div>

                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={simData}>
                         <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} />
                         <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                         <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(val: number) => formatCurrency(val)} />
                         <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                   <p className="text-sm text-slate-600">Total Acumulado:</p>
                   <p className="text-2xl font-bold text-indigo-700">{formatCurrency(simData[simData.length - 1]?.amount || 0)}</p>
                </div>
             </div>

             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Meus Ativos</h3>
                <div className="space-y-4">
                   {investments.map(inv => (
                     <div key={inv.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-xs font-bold text-indigo-500 uppercase">{inv.type}</p>
                              <p className="font-bold text-slate-800">{inv.name}</p>
                           </div>
                           <TrendingUp size={16} className="text-emerald-500" />
                        </div>
                        <div className="mt-3 flex justify-between items-end">
                           <div>
                              <p className="text-xs text-slate-400">Valor Atual</p>
                              <p className="font-bold text-slate-700">{formatCurrency(inv.currentValue)}</p>
                           </div>
                           <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                             +{((inv.currentValue - inv.amount) / inv.amount * 100).toFixed(1)}%
                           </span>
                        </div>
                     </div>
                   ))}
                   <button className="w-full py-2 border-2 border-dashed border-slate-300 text-slate-400 rounded-xl text-sm font-bold hover:border-indigo-400 hover:text-indigo-500 transition">
                      + Adicionar Ativo
                   </button>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};