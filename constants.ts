import { BudgetRule, Goal, Investment, Transaction } from "./types";

export const CURRENCY_SYMBOL = "Kz";

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('AOA', 'Kz');
};

const getDaysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', description: 'Salário Mensal', amount: 450000, date: getDaysAgo(5), type: 'income', category: 'Salário', isFixed: true },
  { id: '2', description: 'Freelance Design', amount: 80000, date: getDaysAgo(12), type: 'income', category: 'Extra', isFixed: false },
  { id: '3', description: 'Supermercado Kero', amount: 45000, date: getDaysAgo(2), type: 'expense', category: 'Alimentação', isFixed: false },
  { id: '4', description: 'Renda da Casa', amount: 150000, date: getDaysAgo(25), type: 'expense', category: 'Habitação', isFixed: true },
  { id: '5', description: 'Unitel Recarga', amount: 2000, date: getDaysAgo(1), type: 'expense', category: 'Comunicação', isFixed: false },
  { id: '6', description: 'Jantar Fora', amount: 15000, date: getDaysAgo(8), type: 'expense', category: 'Lazer', isFixed: false },
  { id: '7', description: 'Combustível', amount: 12000, date: getDaysAgo(15), type: 'expense', category: 'Transporte', isFixed: false },
];

export const MOCK_INVESTMENTS: Investment[] = [
  { id: '1', name: 'Título do Tesouro', type: 'Renda Fixa', amount: 500000, currentValue: 525000, returnRate: 12 },
  { id: '2', name: 'BAI Ações', type: 'Ações', amount: 200000, currentValue: 215000, returnRate: 8 },
];

export const MOCK_GOALS: Goal[] = [
  { id: '1', title: 'Reserva de Emergência', targetAmount: 1500000, currentAmount: 450000, deadline: '2024-06-01', type: 'Reserva' },
  { id: '2', title: 'Casa Própria', targetAmount: 25000000, currentAmount: 2000000, deadline: '2030-01-01', type: 'Casa' },
];

export const DEFAULT_BUDGET_RULE: BudgetRule = {
  needs: 50,
  wants: 30,
  savings: 20,
};

export const QUOTES = [
  "Não depender de uma única fonte de renda.",
  "Quem não tem reserva, vive em risco financeiro.",
  "Invista em conhecimento, rende sempre os melhores juros.",
  "Gaste menos do que ganha e invista a diferença.",
  "O hábito de poupar é mais importante que a quantia."
];

export const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];