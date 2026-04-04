export interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
}

export const CATEGORIES = ['Salary', 'Food', 'Shopping', 'Travel', 'Groceries', 'Entertainment', 'Utilities'];

export const mockTransactions: Transaction[] = [
  { id: 1, date: '2026-03-01', amount: 5200, category: 'Salary', type: 'income', description: 'Monthly salary' },
  { id: 2, date: '2026-03-02', amount: 45, category: 'Food', type: 'expense', description: 'Lunch at cafe' },
  { id: 3, date: '2026-03-03', amount: 120, category: 'Shopping', type: 'expense', description: 'New headphones' },
  { id: 4, date: '2026-03-05', amount: 350, category: 'Travel', type: 'expense', description: 'Flight tickets' },
  { id: 5, date: '2026-03-06', amount: 85, category: 'Groceries', type: 'expense', description: 'Weekly groceries' },
  { id: 6, date: '2026-03-08', amount: 1500, category: 'Salary', type: 'income', description: 'Freelance project' },
  { id: 7, date: '2026-03-10', amount: 60, category: 'Entertainment', type: 'expense', description: 'Movie tickets' },
  { id: 8, date: '2026-03-12', amount: 200, category: 'Shopping', type: 'expense', description: 'New shoes' },
  { id: 9, date: '2026-03-14', amount: 95, category: 'Utilities', type: 'expense', description: 'Electric bill' },
  { id: 10, date: '2026-03-15', amount: 35, category: 'Food', type: 'expense', description: 'Pizza delivery' },
  { id: 11, date: '2026-03-18', amount: 500, category: 'Salary', type: 'income', description: 'Bonus payment' },
  { id: 12, date: '2026-03-20', amount: 150, category: 'Groceries', type: 'expense', description: 'Monthly stock-up' },
  { id: 13, date: '2026-03-22', amount: 75, category: 'Entertainment', type: 'expense', description: 'Concert ticket' },
  { id: 14, date: '2026-03-25', amount: 40, category: 'Food', type: 'expense', description: 'Coffee & snacks' },
  { id: 15, date: '2026-03-28', amount: 180, category: 'Travel', type: 'expense', description: 'Uber rides' },
];
