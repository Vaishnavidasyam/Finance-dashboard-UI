import { useEffect, useRef, useState } from "react";
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/calculations";

interface SummaryCardsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

/* CountUp */
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
  }, [target]);

  return value;
}

function AnimatedAmount({ value }: { value: number }) {
  const animated = useCountUp(Math.abs(value));
  const prefix = value >= 0 ? "+" : "-";

  return (
    <span className="text-3xl font-black tracking-tight">
      {prefix}₹{formatCurrency(animated)}
    </span>
  );
}

const cards = [
  {
    key: "balance",
    title: "Net Balance",
    subtitle: "Current standing",
    icon: Wallet,
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
  },
  {
    key: "income",
    title: "Total Income",
    subtitle: "Money in",
    icon: ArrowUpRight,
    gradient: "from-emerald-400 via-green-500 to-teal-600",
  },
  {
    key: "expense",
    title: "Total Expenses",
    subtitle: "Money out",
    icon: ArrowDownRight,
    gradient: "from-rose-400 via-red-500 to-pink-600",
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
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const val = values[card.key as keyof typeof values];
        const pct = maxVal > 0 ? (Math.abs(val) / maxVal) * 100 : 0;
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="relative group rounded-2xl p-[1px] bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/5"
          >
            {/* Glow Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />

            {/* Card */}
            <div className="relative rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
              {/* Gradient Blob */}
              <div
                className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl`}
              />

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {card.title}
                  </p>

                  <p className="text-xs text-muted-foreground/70">
                    {card.subtitle}
                  </p>
                </div>

                <div
                  className={`p-2 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              {/* Gradient Amount */}
              <div
                className={`bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
              >
                <AnimatedAmount value={val} />
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${card.gradient} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  {pct.toFixed(0)}% of total
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
