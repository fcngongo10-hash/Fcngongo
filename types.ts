export type TransactionType = 'income' | 'expense' | 'investment';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string;
  isFixed?: boolean;
}

export interface BudgetRule {
  needs: number; // 50%
  wants: number; // 30%
  savings: number; // 20%
}

export interface Investment {
  id: string;
  name: string;
  type: 'Renda Fixa' | 'Ações' | 'Fundos' | 'Negócio Próprio';
  amount: number;
  currentValue: number;
  returnRate: number; // Annual %
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  type: 'Reserva' | 'Casa' | 'Estudos' | 'Liberdade Financeira' | 'Outro';
}

export type ViewState = 'dashboard' | 'income' | 'budget' | 'savings' | 'investments' | 'planning';
