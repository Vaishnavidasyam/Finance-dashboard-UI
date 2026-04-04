import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Transaction, CATEGORIES } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (t: Omit<Transaction, 'id'>) => void;
  editing: Transaction | null;
}

const TransactionModal = ({ open, onClose, onSave, editing }: TransactionModalProps) => {
  const [form, setForm] = useState({ date: '', amount: '', category: CATEGORIES[0], type: 'expense' as 'income' | 'expense', description: '' });

  useEffect(() => {
    if (editing) {
      setForm({ date: editing.date, amount: String(editing.amount), category: editing.category, type: editing.type, description: editing.description });
    } else {
      setForm({ date: new Date().toISOString().split('T')[0], amount: '', category: CATEGORIES[0], type: 'expense', description: '' });
    }
  }, [editing, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.amount || !form.description) return;
    onSave({ date: form.date, amount: Number(form.amount), category: form.category, type: form.type, description: form.description });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">{editing ? 'Edit' : 'Add'} Transaction</h2>
              <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-accent"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
                <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Amount</label>
                  <input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" required />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Type</label>
                <div className="flex gap-4">
                  {(['income', 'expense'] as const).map(type => (
                    <label key={type} className="flex cursor-pointer items-center gap-2">
                      <input type="radio" name="type" value={type} checked={form.type === type} onChange={() => setForm({ ...form, type })} className="accent-primary" />
                      <span className={`text-sm font-medium capitalize ${type === 'income' ? 'text-success' : 'text-danger'}`}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                {editing ? 'Update' : 'Add'} Transaction
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
