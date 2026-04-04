import { useState, useEffect } from "react";
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

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
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
  const messages = [
    "Track your expenses smartly 💡",
    "Stay on top of your finances 💰",
    "Make better money decisions 📊",
    "Control your spending habits 🚀",
    "Your financial clarity starts here ✨",
  ];
  const [currentMsg, setCurrentMsg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsg((prev) => (prev + 1) % messages.length);
    }, 3000); // change every 3 sec

    return () => clearInterval(interval);
  }, []);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* NAVBAR */}
        <Navbar
          role={role}
          onRoleChange={setRole}
          isDark={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
          onResetData={reset}
        />

        {/* MAIN */}
        <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center gap-3"
          >
            {/* Glow */}
            <div className="absolute inset-0 blur-2xl opacity-20 bg-gradient-to-r from-blue-500 to-purple-500" />

            <Sparkles className="h-6 w-6 text-blue-500 relative z-10" />

            <div className="relative z-10">
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Dashboard
              </h1>

              {/* ✅ Rotating Text */}
              <div className="relative h-5 overflow-hidden">
                <p
                  key={currentMsg}
                  className="text-sm text-muted-foreground transition-all duration-500 animate-fade-in-up"
                >
                  {messages[currentMsg]}
                </p>
              </div>
            </div>

            {/* RESET BUTTON */}
            <button
              onClick={reset}
              className="ml-auto relative px-4 py-2 text-sm rounded-xl border border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur hover:scale-105 transition group"
            >
              <span className="relative z-10 flex items-center gap-2">
                ↺ Reset
              </span>

              <div className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-40 bg-gradient-to-r from-blue-500 to-purple-500 transition" />
            </button>
          </motion.div>

          {/* LOADING */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          ) : (
            <>
              {/* CARDS */}
              <SummaryCards
                balance={balance}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
              />

              {/* CHARTS */}
              <Charts
                monthlyTrend={monthlyTrend}
                categoryTotals={categoryTotals}
              />

              {/* INSIGHTS */}
              <InsightsBox transactions={transactions} />

              {/* TABLE */}
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

        {/* FLOATING BUTTON */}
        {role === "admin" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="fixed bottom-6 right-6 group"
          >
            {/* Glow */}
            <div className="absolute inset-0 blur-xl opacity-50 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />

            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-2xl transition-all">
              <Plus className="h-6 w-6 group-hover:rotate-90 transition" />
            </div>
          </motion.button>
        )}

        {/* MODAL */}
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
