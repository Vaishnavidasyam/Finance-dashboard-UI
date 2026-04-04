import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  calculateTotals,
  getCategoryTotals,
  getMonthlyTrend,
} from "@/utils/calculations";
import { Transaction } from "@/data/mockData";
import { useTransactions } from "@/hooks/useTransactions";
import Navbar from "@/components/dashboard/Navbar";
import SummaryCards from "@/components/dashboard/SummaryCards";
import Charts from "@/components/dashboard/Charts";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import TransactionModal from "@/components/dashboard/TransactionModal";
import InsightsBox from "@/components/dashboard/InsightsBox";

const Index = () => {
  const { transactions, loading, add, update, remove, reset } =
    useTransactions();
  const [role, setRole] = useLocalStorage<"admin" | "viewer">(
    "fh-role",
    "admin",
  );
  /*const [filters, setFilters] = useLocalStorage("fh-filters", {
    search: "",
    type: "all",
    sort: "date-desc",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
    category: "all",
  });*/
  const [filters, setFilters] = useState({
    search: "",
    type: "all", // 👈 IMPORTANT
    sort: "date-desc",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
    category: "all",
  });
  const [darkMode, setDarkMode] = useLocalStorage("fh-dark", false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const { totalIncome, totalExpense, balance } = calculateTotals(transactions);
  const categoryTotals = getCategoryTotals(transactions);
  const monthlyTrend = getMonthlyTrend(transactions);

  const handleSave = async (data: Omit<Transaction, "id">) => {
    if (editing) {
      await update(editing.id, data);
    } else {
      await add(data);
    }
    setEditing(null);
    setModalOpen(false);
  };

  const handleEdit = (t: Transaction) => {
    setEditing(t);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await remove(id);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <Navbar
          role={role}
          setRole={setRole}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5 text-primary" />

            <div>
              <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Your financial overview at a glance
              </p>
            </div>

            {/* Reset Button */}
            <button
              onClick={reset}
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              ↺ Reset Data
            </button>
          </motion.div>

          {/* Loading spinner */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <SummaryCards
                balance={balance}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
              />
              <Charts
                monthlyTrend={monthlyTrend}
                categoryTotals={categoryTotals}
              />
              <InsightsBox transactions={transactions} />
              <TransactionsTable
                transactions={transactions}
                role={role}
                onEdit={handleEdit}
                onDelete={handleDelete}
                filters={filters}
                setFilters={setFilters}
              />
            </>
          )}
        </main>

        {/* Floating Add Button */}
        {role === "admin" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/40 transition-shadow hover:shadow-2xl hover:shadow-blue-500/50"
            aria-label="Add transaction"
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        )}

        <TransactionModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
          editing={editing}
        />
      </div>
    </div>
  );
};

export default Index;
