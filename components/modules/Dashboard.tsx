import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, PieChart as PieIcon, Download } from 'lucide-react';
import { formatCurrency, getRandomQuote } from '../../constants';
import { Transaction, Goal } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, BarChart, Bar, Legend } from 'recharts';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface DashboardProps {
  transactions: Transaction[];
  goals: Goal[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, goals }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0';

  const emergencyGoal = goals.find(g => g.type === 'Reserva');
  const emergencyProgress = emergencyGoal 
    ? (emergencyGoal.currentAmount / emergencyGoal.targetAmount) * 100 
    : 0;

  // Chart 1: Income vs Expense (Mock data logic tailored for demo)
  const chartData = [
    { name: 'Jan', income: 400000, expense: 350000 },
    { name: 'Fev', income: 450000, expense: 380000 },
    { name: 'Mar', income: 420000, expense: 300000 },
    { name: 'Abr', income: 500000, expense: 410000 },
    { name: 'Mai', income: totalIncome, expense: totalExpense },
  ];

  // Chart 2: Health Pie Data
  const pieData = [
    { name: 'Gasto', value: totalExpense },
    { name: 'Poupado', value: balance > 0 ? balance : 0 },
  ];
  const COLORS = ['#ef4444', '#10b981'];

  // Chart 3: Expenses by Category (Last 30 Days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentExpenses = transactions.filter(t => {
    if (t.type !== 'expense') return false;
    const tDate = new Date(t.date);
    return tDate >= thirtyDaysAgo && tDate <= new Date(); 
  });

  const categoryAggregation = recentExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryAggregation)
    .map(([name, value]) => ({ 
      name, 
      value,
      percent: totalExpense > 0 ? ((value / recentExpenses.reduce((a, c) => a + c.amount, 0)) * 100).toFixed(1) : 0
    }))
    .sort((a, b) => b.value - a.value);

  const CATEGORY_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

  const exportPDF = () => {
    if (categoryChartData.length === 0) return;

    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString('pt-AO');

    // Header
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // Emerald color
    doc.text("KwanzaFlow", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Relatório de Despesas por Categoria (30 Dias)", 14, 30);
    doc.text(`Data de Emissão: ${dateStr}`, 14, 35);

    // Table Data
    const tableData = categoryChartData.map(item => [
      item.name,
      formatCurrency(item.value),
      item.percent + '%'
    ]);

    // Table
    autoTable(doc, {
      head: [['Categoria', 'Valor (Kz)', 'Percentagem']],
      body: tableData,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }, // Emerald
      styles: { fontSize: 10 },
      foot: [['TOTAL', formatCurrency(recentExpenses.reduce((acc, curr) => acc + curr.amount, 0)), '100%']]
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 50;
    doc.text("KwanzaFlow - O seu parceiro financeiro.", 14, finalY + 10);

    doc.save(`despesas_kwanzaflow_${dateStr.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quote Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <p className="font-medium text-lg italic opacity-90">"{getRandomQuote()}"</p>
        <div className="mt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-75">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Dica do Dia
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <ArrowUpRight className="text-emerald-600" size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Renda Mensal</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalIncome)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 rounded-xl">
              <ArrowDownRight className="text-rose-600" size={24} />
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">+5%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Despesas Mensais</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalExpense)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{savingsRate}%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Saldo / Poupança</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(balance)}</h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Fluxo de Caixa (Últimos 5 Meses)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="Entradas" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="Saídas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Saúde Financeira</h3>
          <div className="h-48 relative flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-800">{savingsRate}%</span>
                <span className="text-xs text-slate-500">Poupança</span>
             </div>
          </div>
          
          <div className="mt-4 space-y-3">
             <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  Poupado
                </span>
                <span className="font-semibold">{formatCurrency(balance > 0 ? balance : 0)}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  Gasto
                </span>
                <span className="font-semibold">{formatCurrency(totalExpense)}</span>
             </div>
          </div>

          {!emergencyGoal || emergencyProgress < 20 ? (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
              <AlertTriangle className="text-amber-500 shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-amber-700">Atenção</p>
                <p className="text-xs text-amber-600 mt-1">Sua reserva de emergência está baixa.</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* New Section: Expense Categories (Horizontal Bar Chart) */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <PieIcon size={20} className="text-indigo-500"/>
              Despesas por Categoria (30 dias)
            </h3>
            
            <div className="flex items-center gap-3 mt-2 md:mt-0">
              <span className="text-xs font-medium bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                {recentExpenses.length} transações
              </span>
              <button
                onClick={exportPDF}
                disabled={categoryChartData.length === 0}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Exportar PDF"
              >
                <Download size={14} />
                PDF
              </button>
            </div>
          </div>
          
          {categoryChartData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={categoryChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={{fontSize: 12, fill: '#64748b'}}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number, name: string, props: any) => [
                      `${formatCurrency(value)} (${props.payload.percent}%)`, 
                      'Gasto'
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-slate-400">
               <PieIcon size={40} className="mb-2 opacity-20" />
               <p className="text-sm">Sem despesas registradas nos últimos 30 dias.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};