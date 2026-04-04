import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, CheckCircle2, Flame } from 'lucide-react';
import { formatCurrency, getHighestCategory, calculateTotals, getCategoryTotals } from '@/utils/calculations';
import { Transaction } from '@/data/mockData';

interface InsightItem {
  icon: React.ElementType;
  color: string;
  bg: string;
  title: string;
  body: React.ReactNode;
}

export default function InsightsBox({ transactions }: { transactions: Transaction[] }) {
  const highest = getHighestCategory(transactions);
  const { totalIncome, totalExpense, balance } = calculateTotals(transactions);
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(0) : '0';
  const catTotals = getCategoryTotals(transactions);
  const topTwo = catTotals.slice(0, 2);

  if (!highest) return null;

  const savingsNum = Number(savingsRate);
  const isHealthy = savingsNum >= 20;

  const insights: InsightItem[] = [
    {
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      title: 'Top Spending Category',
      body: (
        <>
          <span className="font-semibold text-foreground">{highest.name}</span> accounts for{' '}
          <span className="font-semibold text-danger">{highest.percentage}%</span> of your expenses (
          {formatCurrency(highest.amount)}).
        </>
      ),
    },
    {
      icon: isHealthy ? CheckCircle2 : AlertTriangle,
      color: isHealthy ? 'text-emerald-500' : 'text-amber-500',
      bg: isHealthy ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-amber-50 dark:bg-amber-950/30',
      title: 'Savings Rate',
      body: (
        <>
          You saved{' '}
          <span className={`font-semibold ${isHealthy ? 'text-success' : 'text-amber-600'}`}>
            {savingsRate}%
          </span>{' '}
          of your income.{' '}
          {isHealthy ? '🎉 Great job! Keep it up.' : 'Aim for 20%+ for financial health.'}
        </>
      ),
    },
    {
      icon: Lightbulb,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      title: 'Spending Tip',
      body: topTwo.length >= 2 ? (
        <>
          Your top 2 categories —{' '}
          <span className="font-semibold text-foreground">{topTwo[0].name}</span> &{' '}
          <span className="font-semibold text-foreground">{topTwo[1].name}</span> — make up{' '}
          <span className="font-semibold text-primary">
            {((( topTwo[0].value + topTwo[1].value) / totalExpense) * 100).toFixed(0)}%
          </span>{' '}
          of total expenses. Reducing these would have the highest impact.
        </>
      ) : (
        'Add more transactions to get personalized tips!'
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-lg"
    >
      <div className="mb-5 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Smart Insights</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="rounded-xl border border-border/60 bg-background/50 p-4"
            >
              <div className={`mb-3 inline-flex rounded-lg p-2 ${ins.bg}`}>
                <Icon className={`h-4 w-4 ${ins.color}`} />
              </div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {ins.title}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">{ins.body}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
