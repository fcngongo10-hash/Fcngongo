import React, { useState, useEffect } from 'react';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/modules/Dashboard';
import { IncomeModule } from './components/modules/Income';
import { BudgetModule } from './components/modules/Budget';
import { SavingsInvestModule } from './components/modules/SavingsInvest';
import { PlanningModule } from './components/modules/Planning';
import { Transaction, Goal, ViewState } from './types';
import { MOCK_TRANSACTIONS, MOCK_GOALS, MOCK_INVESTMENTS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isPremium, setIsPremium] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('kf_transactions');
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });
  
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);

  useEffect(() => {
    localStorage.setItem('kf_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newT = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setTransactions([newT, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard transactions={transactions} goals={goals} />;
      case 'income':
        return <IncomeModule 
          transactions={transactions} 
          onAddTransaction={addTransaction} 
          onDeleteTransaction={deleteTransaction}
        />;
      case 'budget':
        return <BudgetModule 
          transactions={transactions} 
          onAddTransaction={addTransaction}
        />;
      case 'savings':
      case 'investments': // Shared view
        return <SavingsInvestModule goals={goals} investments={MOCK_INVESTMENTS} />;
      case 'planning':
        return <PlanningModule />;
      default:
        return <Dashboard transactions={transactions} goals={goals} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={setCurrentView}
      isPremium={isPremium}
      togglePremium={() => setIsPremium(!isPremium)}
    >
      {renderView()}
    </Layout>
  );
};

export default App;