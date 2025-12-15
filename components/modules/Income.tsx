import React, { useState } from 'react';
import { Plus, Trash2, Briefcase, TrendingUp, DollarSign, AlertCircle, Filter, X } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../constants';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from 'recharts';

interface IncomeProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export const IncomeModule: React.FC<IncomeProps> = ({ transactions, onAddTransaction, onDeleteTransaction }) => {
  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salário');
  const [isFixed, setIsFixed] = useState(true);

  // Filter State
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todas');

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const totalIncome = incomeTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  // Group by category to check diversification
  const categoryTotals = incomeTransactions.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const sortedSources = Object.entries(categoryTotals).sort((a, b) => {
    const amountA = a[1] as number;
    const amountB = b[1] as number;
    return amountB - amountA;
  });

  const maxSource = sortedSources[0];
  const maxSourceAmount = maxSource ? maxSource[1] : 0;
  const isDependent = maxSource && totalIncome > 0 && (maxSourceAmount / totalIncome) > 0.8;

  // Chart Data: Last 6 Months
  const today = new Date();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
    return {
      key: d.toISOString().slice(0, 7), // YYYY-MM
      label: d.toLocaleDateString('pt-AO', { month: 'short' }).replace('.', ''),
    };
  });

  const chartData = last6Months.map(m => {
    const total = incomeTransactions
      .filter(t => t.date.startsWith(m.key))
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: m.label, value: total };
  });

  // Filter Logic
  const filteredTransactions = incomeTransactions.filter(t => {
    const tDate = new Date(t.date);
    // Reset time part for accurate date comparison
    tDate.setHours(0, 0, 0, 0);

    if (filterStartDate) {
      const startDate = new Date(filterStartDate);
      startDate.setHours(0, 0, 0, 0);
      if (tDate < startDate) return false;
    }
    
    if (filterEndDate) {
      const endDate = new Date(filterEndDate);
      endDate.setHours(0, 0, 0, 0);
      if (tDate > endDate) return false;
    }

    if (filterCategory !== 'Todas' && t.category !== filterCategory) return false;

    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    
    onAddTransaction({
      description,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      type: 'income',
      category,
      isFixed
    });
    
    setDescription('');
    setAmount('');
  };

  const clearFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterCategory('Todas');
  };

  const hasActiveFilters = filterStartDate || filterEndDate || filterCategory !== 'Todas';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Renda & Receitas</h2>
          <p className="text-slate-500 text-sm">Módulo 1: Ganhar Dinheiro</p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <DollarSign size={18} />
          Total: {formatCurrency(totalIncome)}
        </div>
      </div>

      {isDependent && maxSource && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl flex items-start gap-3">
          <AlertCircle className="text-orange-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-orange-800 text-sm">Alerta de Diversificação</h4>
            <p className="text-orange-700 text-sm mt-1">
              {Math.round((maxSourceAmount / totalIncome) * 100)}% da sua renda vem de uma única fonte ({maxSource[0]}). 
              Regra de Ouro: "Não depender de uma única fonte de renda." Tente criar uma renda extra ou passiva.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-emerald-500" />
            Adicionar Renda
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Descrição</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="Ex: Salário, Venda de Bolo..."
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Valor (Kz)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Tipo</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="Salário">Salário</option>
                  <option value="Negócio">Negócio</option>
                  <option value="Freelance">Extra / Freelance</option>
                  <option value="Passiva">Renda Passiva</option>
                </select>
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isFixed} 
                    onChange={(e) => setIsFixed(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-600">Renda Fixa?</span>
                </label>
              </div>
            </div>

            <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
              Adicionar Entrada
            </button>
          </form>
        </div>

        {/* Right Column: Chart + List */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* Summary Chart */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Evolução Mensal (Últimos 6 Meses)</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 12}} 
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      formatter={(value: number) => [formatCurrency(value), 'Renda']}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* List Card */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                 <h3 className="font-bold text-slate-800">Histórico de Rendas</h3>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                   <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">
                     {filteredTransactions.length} registros
                   </span>
                 </div>
               </div>

               {/* Filters */}
               <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
                 <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-600">
                   <Filter size={16} />
                   Filtros
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                   <div>
                     <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">De</label>
                     <input 
                        type="date" 
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Até</label>
                     <input 
                        type="date" 
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Categoria</label>
                     <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                     >
                       <option value="Todas">Todas</option>
                       <option value="Salário">Salário</option>
                       <option value="Negócio">Negócio</option>
                       <option value="Freelance">Extra / Freelance</option>
                       <option value="Passiva">Renda Passiva</option>
                     </select>
                   </div>
                 </div>
                 {hasActiveFilters && (
                    <button 
                      onClick={clearFilters}
                      className="mt-3 text-xs text-rose-500 font-medium flex items-center gap-1 hover:text-rose-600"
                    >
                      <X size={14} /> Limpar Filtros
                    </button>
                 )}
               </div>

               <div className="space-y-3">
                 {filteredTransactions.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                       <Briefcase size={40} className="mx-auto mb-2 opacity-50" />
                       <p>{hasActiveFilters ? 'Nenhum resultado para os filtros.' : 'Nenhuma renda registrada.'}</p>
                    </div>
                 ) : (
                    filteredTransactions.map(t => (
                      <div key={t.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition group">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.category === 'Salário' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                             {t.category === 'Passiva' ? <TrendingUp size={18} /> : <Briefcase size={18} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                            <p className="text-xs text-slate-500">{t.date} • {t.isFixed ? 'Fixo' : 'Variável'} • {t.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-emerald-600">{formatCurrency(t.amount)}</span>
                          <button 
                            onClick={() => onDeleteTransaction(t.id)}
                            className="text-slate-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                 )}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};