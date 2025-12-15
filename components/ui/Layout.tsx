import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  PiggyBank, 
  TrendingUp, 
  Map, 
  Bell,
  Menu,
  ShieldCheck
} from 'lucide-react';
import { ViewState } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isPremium: boolean;
  togglePremium: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  setView, 
  isPremium, 
  togglePremium 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems: { id: ViewState; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'income', label: 'Renda', icon: Wallet },
    { id: 'budget', label: 'Orçamento', icon: PieChart },
    { id: 'savings', label: 'Reserva', icon: PiggyBank },
    { id: 'investments', label: 'Investir', icon: TrendingUp },
    { id: 'planning', label: 'Futuro', icon: Map },
  ];

  const handleNavClick = (id: ViewState) => {
    setView(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
      {/* Mobile Header */}
      <header className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
             <span className="text-white font-bold">K</span>
          </div>
          <h1 className="font-bold text-lg text-slate-800">KwanzaFlow</h1>
        </div>
        <div className="flex gap-4">
           <button onClick={togglePremium} className={`${isPremium ? 'text-amber-500' : 'text-slate-400'}`}>
              <ShieldCheck size={24} />
           </button>
           <Bell className="text-slate-600" size={24} />
        </div>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
             <span className="text-white font-bold text-xl">K</span>
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">KwanzaFlow</h1>
            <p className="text-xs text-slate-500">Angola</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} strokeWidth={currentView === item.id ? 2.5 : 2} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 text-white p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-sm">Plano {isPremium ? 'Premium' : 'Gratuito'}</span>
              <ShieldCheck size={16} className={isPremium ? 'text-amber-400' : 'text-slate-400'} />
            </div>
            <p className="text-xs text-slate-400 mb-3">
              {isPremium ? 'Funcionalidades avançadas ativas.' : 'Desbloqueie relatórios avançados.'}
            </p>
            <button 
              onClick={togglePremium}
              className="w-full bg-white text-slate-900 text-xs font-bold py-2 rounded-lg hover:bg-slate-100 transition"
            >
              {isPremium ? 'Gerir Plano' : 'Upgrade para Pro'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-20 pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              currentView === item.id ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={24} strokeWidth={currentView === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};