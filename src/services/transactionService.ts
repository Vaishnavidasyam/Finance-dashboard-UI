import { Transaction, mockTransactions } from "@/data/mockData";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const KEY = "fh-transactions";

export const transactionService = {
  // ✅ Load from localStorage, fallback to mock data if empty
  async getAll(): Promise<Transaction[]> {
    await delay(400);

    try {
      const stored = localStorage.getItem(KEY);

      if (!stored) {
        localStorage.setItem(KEY, JSON.stringify(mockTransactions));
        return mockTransactions;
      }

      const parsed: Transaction[] = JSON.parse(stored);

      // ✅ ADD THIS FIX
      if (!parsed || parsed.length === 0) {
        localStorage.setItem(KEY, JSON.stringify(mockTransactions));
        return mockTransactions;
      }

      return parsed;
    } catch {
      localStorage.setItem(KEY, JSON.stringify(mockTransactions));
      return mockTransactions;
    }
  },

  // ✅ Add new transaction and save to localStorage
  async create(t: Omit<Transaction, "id">): Promise<Transaction> {
    await delay(300);
    const all = await this.getAll();
    const newT: Transaction = {
      ...t,
      id: Math.max(0, ...all.map((x) => x.id)) + 1,
    };
    localStorage.setItem(KEY, JSON.stringify([...all, newT]));
    return newT;
  },

  // ✅ Update existing transaction and save to localStorage
  async update(id: number, t: Omit<Transaction, "id">): Promise<Transaction> {
    await delay(300);
    const all = await this.getAll();
    const updated = all.map((x) => (x.id === id ? { ...x, ...t } : x));
    localStorage.setItem(KEY, JSON.stringify(updated));
    return { ...t, id };
  },

  // ✅ Delete transaction and save to localStorage
  async remove(id: number): Promise<void> {
    await delay(200);
    const all = await this.getAll();
    const filtered = all.filter((x) => x.id !== id);
    localStorage.setItem(KEY, JSON.stringify(filtered));
  },

  // ✅ Reset everything back to mock data
  async reset(): Promise<Transaction[]> {
    await delay(200);
    localStorage.setItem(KEY, JSON.stringify(mockTransactions));
    return mockTransactions;
  },
};
