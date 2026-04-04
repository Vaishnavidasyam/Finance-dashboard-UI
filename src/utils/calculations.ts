import { Transaction } from '@/data/mockData';
import { format, parseISO } from 'date-fns';

export const calculateTotals = (transactions: Transaction[]) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
};

export const getCategoryTotals = (transactions: Transaction[]) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const map: Record<string, number> = {};
  expenses.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
  return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};

export const getMonthlyTrend = (transactions: Transaction[]) => {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  let balance = 0;
  const map: Record<string, number> = {};
  sorted.forEach(t => {
    balance += t.type === 'income' ? t.amount : -t.amount;
    const month = format(parseISO(t.date), 'MMM dd');
    map[month] = balance;
  });
  return Object.entries(map).map(([date, balance]) => ({ date, balance }));
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const getHighestCategory = (transactions: Transaction[]) => {
  const totals = getCategoryTotals(transactions);
  if (totals.length === 0) return null;
  const total = totals.reduce((s, t) => s + t.value, 0);
  const highest = totals[0];
  return { name: highest.name, amount: highest.value, percentage: Math.round((highest.value / total) * 100) };
};
