import React, { useState } from 'react';
import { ShoppingBag, Home, Coffee, AlertTriangle, Plus, DollarSign } from 'lucide-react';
import { Transaction, BudgetRule } from '../../types';
import { formatCurrency } from '../../constants';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface BudgetProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
}

export const BudgetModule: React.FC<BudgetProps> = ({ transactions, onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [isFixed, setIsFixed] = useState(false);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Categorize expenses for 50/30/20
  const needs = expenses.filter(t => t.isFixed).reduce((acc, curr) => acc + curr.amount, 0);
  const wants = expenses.filter(t => !t.isFixed).reduce((acc, curr) => acc + curr.amount, 0);
  const savings = totalIncome - (needs + wants);

  const rule50 = totalIncome * 0.5;
  const rule30 = totalIncome * 0.3;
  const rule20 = totalIncome * 0.2;

  const data = [
    { name: 'Necessidades (50%)', value: needs, target: rule50, color: '#3b82f6' },
    { name: 'Desejos (30%)', value: wants, target: rule30, color: '#f43f5e' },
    { name: 'Poupança (20%)', value: savings > 0 ? savings : 0, target: rule20, color: '#10b981' },
  ];

  const getProgressColor = (current: number, max: number) => {
    if (current > max) return 'bg-rose-500';
    if (current > max * 0.9) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    
    onAddTransaction({
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      category,
      isFixed
    });
    
    setDescription('');
    setAmount('');
    setIsFixed(false);
  };

  const categories = [
    "Alimentação", "Habitação", "Transporte", "Saúde", "Educação", "Lazer", "Comunicação", "Outros"
  ];

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Orçamento Mensal</h2>
          <p className="text-slate-500 text-sm">Módulo 2: Regra 50/30/20</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-rose-500" />
            Nova Despesa
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Descrição</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                placeholder="Ex: Supermercado..."
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Valor (Kz)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 pl-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                  placeholder="0"
                />
                <DollarSign size={16} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Categoria</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                <input 
                  type="checkbox" 
                  checked={isFixed} 
                  onChange={(e) => setIsFixed(e.target.checked)}
                  className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500"
                />
                <div className="text-sm">
                  <span className="font-semibold text-slate-700 block">Despesa Fixa?</span>
                  <span className="text-xs text-slate-400">Ex: Aluguel, Escola, Internet (Necessidades)</span>
                </div>
              </label>
            </div>

            <button type="submit" className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
              <Plus size={20} />
              Adicionar Despesa
            </button>
          </form>
        </div>

        {/* Analysis Column */}
        <div className="lg:col-span-2 space-y-6">
           {/* Budget Bars */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="font-bold text-slate-800 mb-4">Análise do Orçamento</h3>
              
              {/* Needs */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <Home size={16} className="text-blue-500"/> Necessidades (Fixas)
                  </span>
                  <span className="text-slate-500">{formatCurrency(needs)} / <span className="text-slate-400">{formatCurrency(rule50)}</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(needs, rule50)}`} 
                    style={{ width: `${Math.min((needs / rule50) * 100, 100)}%` }}
                  ></div>
                </div>
                {needs > rule50 && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertTriangle size={12}/> Excedeu o orçamento de necessidades!</p>}
              </div>

              {/* Wants */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <Coffee size={16} className="text-rose-500"/> Desejos (Variáveis)
                  </span>
                  <span className="text-slate-500">{formatCurrency(wants)} / <span className="text-slate-400">{formatCurrency(rule30)}</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(wants, rule30)}`} 
                    style={{ width: `${Math.min((wants / rule30) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Savings */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <ShoppingBag size={16} className="text-emerald-500"/> Poupança e Objetivos
                  </span>
                  <span className="text-slate-500">{formatCurrency(savings)} / <span className="text-slate-400">{formatCurrency(rule20)}</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-3 rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min((savings / rule20) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detailed List */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Últimas Despesas</h3>
                <div className="space-y-3">
                  {expenses.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">Nenhuma despesa registrada.</p>
                  ) : (
                    expenses.slice(0, 5).map(t => (
                      <div key={t.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.isFixed ? 'bg-blue-50 text-blue-500' : 'bg-rose-50 text-rose-500'}`}>
                                <ShoppingBag size={16} />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-700 block">{t.description}</span>
                              <span className="text-xs text-slate-400">{t.category}</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-slate-600">-{formatCurrency(t.amount)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                  <h3 className="font-bold text-slate-800 mb-2 w-full text-left">Distribuição</h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-3 text-xs text-slate-500 mt-2">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Fixos</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div>Var.</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Poup.</div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};