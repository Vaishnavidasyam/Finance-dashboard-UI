import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/data/mockData";
import { transactionService } from "@/services/transactionService";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Add
  const add = async (t: Omit<Transaction, "id">) => {
    try {
      const newT = await transactionService.create(t);
      setTransactions((prev) => [...prev, newT]);
    } catch {
      setError("Failed to add transaction");
    }
  };

  // Update
  const update = async (id: number, t: Omit<Transaction, "id">) => {
    try {
      const updated = await transactionService.update(id, t);
      setTransactions((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch {
      setError("Failed to update transaction");
    }
  };

  // Delete
  const remove = async (id: number) => {
    try {
      await transactionService.remove(id);
      setTransactions((prev) => prev.filter((x) => x.id !== id));
    } catch {
      setError("Failed to delete transaction");
    }
  };

  // Reset
  const reset = async () => {
    try {
      setLoading(true);
      const data = await transactionService.reset();
      setTransactions(data);
    } catch {
      setError("Failed to reset transactions");
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    loading,
    error,
    add,
    update,
    remove,
    reset,
    refetch: fetchAll,
  };
}
