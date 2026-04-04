import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/calculations";

interface SummaryCardsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(target * ease);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [target, duration]);
  return value;
}

function AnimatedAmount({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const animated = useCountUp(Math.abs(value));
  const prefix = value >= 0 ? "+" : "-";
  return (
    <span className={className}>
      {prefix}
      {formatCurrency(animated)}
    </span>
  );
}

const cards = [
  {
    key: "balance",
    title: "Net Balance",
    subtitle: "Current standing",
    icon: Wallet,
    gradient: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/25",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    bar: "bg-blue-500",
  },
  {
    key: "income",
    title: "Total Income",
    subtitle: "Money in",
    icon: ArrowUpRight,
    gradient: "from-emerald-400 to-teal-600",
    glow: "shadow-emerald-500/25",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
  {
    key: "expense",
    title: "Total Expenses",
    subtitle: "Money out",
    icon: ArrowDownRight,
    gradient: "from-rose-400 to-pink-600",
    glow: "shadow-rose-500/25",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-600 dark:text-rose-400",
    bar: "bg-rose-500",
  },
];

export default function SummaryCards({
  balance,
  totalIncome,
  totalExpense,
}: SummaryCardsProps) {
  const values = { balance, income: totalIncome, expense: totalExpense };
  const maxVal = Math.max(totalIncome, totalExpense, Math.abs(balance));

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => {
        const val = values[card.key as keyof typeof values];
        const pct = maxVal > 0 ? (Math.abs(val) / maxVal) * 100 : 0;
        const Icon = card.icon;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: i * 0.12,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-lg ${card.glow}`}
          >
            {/* Decorative gradient blob */}
            <div
              className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-xl`}
            />

            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {card.subtitle}
                  </p>
                </div>
                <div className={`rounded-xl p-2.5 ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.text}`} />
                </div>
              </div>

              <AnimatedAmount
                value={val}
                className={`block text-3xl font-black tabular-nums tracking-tight ${card.text}`}
              />

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={`h-full rounded-full ${card.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      delay: i * 0.12 + 0.4,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                </div>
                <div className="mt-1.5 flex items-center gap-1">
                  <TrendingUp className={`h-3 w-3 ${card.text}`} />
                  <p className="text-xs text-muted-foreground">
                    {pct.toFixed(0)}% of total
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
