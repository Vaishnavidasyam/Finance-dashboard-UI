import {
  DollarSign,
  Moon,
  Sun,
  User,
  ShieldCheck,
  Menu,
  X,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  role: "admin" | "viewer";
  onRoleChange: (role: "admin" | "viewer") => void;
  isDark: boolean;
  onToggleDark: () => void;
  onResetData?: () => void;
  isResetting?: boolean;
}

export default function Navbar({
  role,
  onRoleChange,
  isDark,
  onToggleDark,
  onResetData,
  isResetting,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-zinc-900/60 border-b border-white/10 shadow-lg">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
        {/* 🔥 LOGO */}
        <div className="relative flex items-center gap-3 group">
          {/* Glow */}
          <div className="absolute -inset-3 opacity-0 group-hover:opacity-100 blur-2xl transition duration-700 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="relative flex items-center gap-2">
            {/* Icon */}
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl group-hover:scale-110 transition">
              <DollarSign className="h-5 w-5 group-hover:rotate-12 transition duration-300" />
            </div>

            {/* Text */}
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              FinanceHub
            </h1>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden sm:flex items-center gap-3">
          {/* 🔄 RESET BUTTON */}

          {/* 🔥 ROLE SWITCH */}
          <div className="flex rounded-xl border border-white/10 bg-white/50 dark:bg-zinc-800/50 backdrop-blur overflow-hidden">
            {(["viewer", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => onRoleChange(r)}
                className="relative px-4 py-1.5 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                {/* Active Background */}
                {role === r && (
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-md" />
                )}

                <span
                  className={`relative flex items-center gap-1 ${
                    role === r
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r === "admin" ? (
                    <>
                      <ShieldCheck className="h-3 w-3" />
                      <Sparkles className="h-3 w-3 animate-pulse" />
                    </>
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  {r}
                </span>
              </button>
            ))}
          </div>

          {/* 🌙 DARK MODE */}
          <button
            onClick={onToggleDark}
            className="relative h-10 w-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur transition-all hover:scale-110 group"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-blue-500" />
            )}

            {/* Glow */}
            <div className="absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-40 bg-gradient-to-r from-blue-500 to-purple-500 transition" />
          </button>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden h-10 w-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* 📱 MOBILE MENU */}
      <div
        className={`sm:hidden transition-all duration-500 overflow-hidden ${
          menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 space-y-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t">
          {/* ROLE */}
          <div className="flex gap-2">
            {(["viewer", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  onRoleChange(r);
                  setMenuOpen(false);
                }}
                className={`flex-1 py-2 rounded-xl text-sm transition ${
                  role === r
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow"
                    : "border"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* RESET */}
          {onResetData && (
            <button
              onClick={onResetData}
              className="w-full py-2 rounded-xl border flex items-center justify-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isResetting ? "animate-spin" : ""}`}
              />
              Reset Data
            </button>
          )}

          {/* DARK MODE */}
          <button
            onClick={onToggleDark}
            className="w-full py-2 rounded-xl border"
          >
            Toggle Theme
          </button>
        </div>
      </div>
    </header>
  );
}
