import { useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  Download,
  X,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction, CATEGORIES } from "@/data/mockData";
import { formatCurrency } from "@/utils/calculations";
import { exportCSV, exportJSON } from "@/utils/exportUtils";
//import { mockTransactions } from "@/data/mockData";

interface Filters {
  search: string;
  type: string;
  sort: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  category: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  role: "admin" | "viewer";
  onEdit: (t: Transaction) => void;
  onDelete: (id: number) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Salary:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  Food: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
  Shopping:
    "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
  Travel: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  Groceries:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400",
  Entertainment:
    "bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400",
  Utilities:
    "bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400",
};

const DEFAULT_FILTERS: Filters = {
  search: "",
  type: "all",
  sort: "date-desc",
  dateFrom: "",
  dateTo: "",
  amountMin: "",
  amountMax: "",
  category: "all",
};

export default function TransactionsTable({
  transactions,
  role,
  onEdit,
  onDelete,
  filters,
  setFilters,
}: TransactionsTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filtered = transactions
    .filter((t) => {
      if (filters.type !== "all" && t.type !== filters.type) return false;
      if (filters.category !== "all" && t.category !== filters.category)
        return false;
      const q = filters.search.toLowerCase();
      if (
        q &&
        !t.description.toLowerCase().includes(q) &&
        !t.category.toLowerCase().includes(q)
      )
        return false;
      if (filters.dateFrom && t.date < filters.dateFrom) return false;
      if (filters.dateTo && t.date > filters.dateTo) return false;
      if (filters.amountMin && t.amount < Number(filters.amountMin))
        return false;
      if (filters.amountMax && t.amount > Number(filters.amountMax))
        return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "date-desc") return b.date.localeCompare(a.date);
      if (filters.sort === "date-asc") return a.date.localeCompare(b.date);
      if (filters.sort === "amount-desc") return b.amount - a.amount;
      return a.amount - b.amount;
    });

  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.amountMin ||
    filters.amountMax;

  const typeFilters = [
    { label: "All", value: "all" },
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
  ];
  const safeTransactions = transactions.length ? transactions : [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
    >
      {/* Header */}
      <div className="border-b border-border px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-foreground">Transactions</h3>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {filtered.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="h-8 w-40 rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground outline-none transition-all focus:w-52 focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Type pills */}
            <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
              {typeFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilters({ ...filters, type: f.value })}
                  className={`relative rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                    filters.type === f.value
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filters.type === f.value && (
                    <motion.div
                      layoutId="typeFilter"
                      className="absolute inset-0 rounded-lg bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative flex items-center">
              <SlidersHorizontal className="absolute left-2.5 h-3 w-3 text-muted-foreground" />
              <select
                value={filters.sort}
                onChange={(e) =>
                  setFilters({ ...filters, sort: e.target.value })
                }
                className="h-8 rounded-lg border border-border bg-background pl-7 pr-3 text-xs text-foreground outline-none"
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="amount-desc">Highest amount</option>
                <option value="amount-asc">Lowest amount</option>
              </select>
            </div>

            {/* Advanced filters toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                showAdvanced
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="h-3 w-3" />
              Filters
              {hasActiveFilters && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </button>

            {/* Export CSV */}
            <button
              onClick={() => exportCSV(filtered)}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Download className="h-3 w-3" />
              CSV
            </button>

            {/* Export JSON */}
            <button
              onClick={() => exportJSON(filtered)}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Download className="h-3 w-3" />
              JSON
            </button>
          </div>
        </div>

        {/* Advanced filters panel */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
                {/* Category */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                    className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date From */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters({ ...filters, dateFrom: e.target.value })
                    }
                    className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Date To */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters({ ...filters, dateTo: e.target.value })
                    }
                    className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Min Amount */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Min Amount ($)
                  </label>
                  <input
                    type="number"
                    value={filters.amountMin}
                    onChange={(e) =>
                      setFilters({ ...filters, amountMin: e.target.value })
                    }
                    placeholder="0"
                    className="h-8 w-24 rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Max Amount */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Max Amount ($)
                  </label>
                  <input
                    type="number"
                    value={filters.amountMax}
                    onChange={(e) =>
                      setFilters({ ...filters, amountMax: e.target.value })
                    }
                    placeholder="∞"
                    className="h-8 w-24 rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Clear All */}
                {hasActiveFilters && (
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-3 text-xs font-semibold text-danger transition-colors hover:bg-danger/20"
                  >
                    <X className="h-3 w-3" />
                    Clear All
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <p className="font-semibold text-foreground">No transactions found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  "Date",
                  "Description",
                  "Category",
                  "Type",
                  "Amount",
                  ...(role === "admin" ? ["Actions"] : []),
                ].map((col) => (
                  <th
                    key={col}
                    className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
                      col === "Amount" || col === "Actions" ? "text-right" : ""
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    className="group border-b border-border/50 transition-colors last:border-0 hover:bg-accent/40"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-muted-foreground">
                      {format(parseISO(t.date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-foreground">
                      {t.description}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          CATEGORY_COLORS[t.category] ??
                          "bg-accent text-accent-foreground"
                        }`}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          t.type === "income"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                        }`}
                      >
                        {t.type === "income" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={`whitespace-nowrap px-5 py-3.5 text-right text-sm font-bold tabular-nums ${
                        t.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "−"}
                      {formatCurrency(t.amount)}
                    </td>

                    {role === "admin" && (
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => onEdit(t)}
                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          {confirmDelete === t.id ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  onDelete(t.id);
                                  setConfirmDelete(null);
                                }}
                                className="rounded-lg bg-danger px-2.5 py-1 text-xs font-semibold text-danger-foreground"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="rounded-lg bg-accent px-2.5 py-1 text-xs font-semibold text-foreground"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(t.id)}
                              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
