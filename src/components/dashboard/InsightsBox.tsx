import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, CheckCircle2, Flame } from "lucide-react";
import {
  formatCurrency,
  getHighestCategory,
  calculateTotals,
  getCategoryTotals,
} from "@/utils/calculations";
import { Transaction } from "@/data/mockData";

interface InsightItem {
  icon: React.ElementType;
  color: string;
  bg: string;
  title: string;
  body: React.ReactNode;
}

export default function InsightsBox({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const highest = getHighestCategory(transactions);
  const { totalIncome, totalExpense, balance } = calculateTotals(transactions);

  const savingsRate =
    totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(0) : "0";

  const catTotals = getCategoryTotals(transactions);
  const topTwo = catTotals.slice(0, 2);

  if (!highest) return null;

  const savingsNum = Number(savingsRate);
  const isHealthy = savingsNum >= 20;

  const insights: InsightItem[] = [
    {
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      title: "Top Spending",
      body: (
        <>
          <span className="font-semibold text-foreground">{highest.name}</span>{" "}
          takes{" "}
          <span className="font-semibold text-red-500">
            {highest.percentage}%
          </span>{" "}
          ({formatCurrency(highest.amount)})
        </>
      ),
    },
    {
      icon: isHealthy ? CheckCircle2 : AlertTriangle,
      color: isHealthy ? "text-emerald-500" : "text-amber-500",
      bg: isHealthy
        ? "bg-emerald-100 dark:bg-emerald-900/30"
        : "bg-amber-100 dark:bg-amber-900/30",
      title: "Savings",
      body: (
        <>
          Saved{" "}
          <span
            className={`font-semibold ${
              isHealthy ? "text-emerald-500" : "text-amber-500"
            }`}
          >
            {savingsRate}%
          </span>{" "}
          {isHealthy ? "✓ Good" : "⚠ Improve"}
        </>
      ),
    },
    {
      icon: Lightbulb,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      title: "Tip",
      body:
        topTwo.length >= 2 ? (
          <>
            Focus on <span className="font-semibold">{topTwo[0].name}</span> &{" "}
            <span className="font-semibold">{topTwo[1].name}</span> (
            {(
              ((topTwo[0].value + topTwo[1].value) / totalExpense) *
              100
            ).toFixed(0)}
            %)
          </>
        ) : (
          "Add more data"
        ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl bg-white dark:bg-zinc-900 shadow-md border p-6"
    >
      {/* HEADER */}
      <div className="mb-5 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-foreground">Insights</h3>
      </div>

      {/* CARDS */}
      <div className="grid gap-4 sm:grid-cols-3">
        {insights.map((ins, i) => {
          const Icon = ins.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="rounded-xl border p-4 bg-gray-50 dark:bg-zinc-800/60 hover:shadow-md transition"
            >
              {/* ICON */}
              <div className={`mb-3 inline-flex rounded-lg p-2 ${ins.bg}`}>
                <Icon className={`h-4 w-4 ${ins.color}`} />
              </div>

              {/* TITLE */}
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {ins.title}
              </p>

              {/* BODY */}
              <p className="text-sm font-medium text-foreground leading-snug">
                {ins.body}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
