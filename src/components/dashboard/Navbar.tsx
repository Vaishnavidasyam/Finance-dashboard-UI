import { motion } from "framer-motion";
import { DollarSign, Moon, Sun, ShieldCheck, Eye, Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

interface NavbarProps {
  role: "admin" | "viewer";
  setRole: (role: "admin" | "viewer") => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export default function Navbar({
  role,
  setRole,
  darkMode,
  setDarkMode,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 border-b border-border/60 bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-foreground">
              Finance
            </span>
            <span className="text-base sm:text-lg font-black tracking-tight text-primary">
              Hub
            </span>
          </div>
        </motion.div>

        {/* Desktop controls */}
        <motion.div
          className="hidden sm:flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          >
            <motion.div
              key={darkMode ? "sun" : "moon"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.div>
          </button>

          <div className="flex items-center overflow-hidden rounded-xl border border-border bg-background p-1">
            {(["admin", "viewer"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${role === r ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {role === r && (
                  <motion.div
                    layoutId="roleActive"
                    className="absolute inset-0 rounded-lg bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {r === "admin" ? (
                    <ShieldCheck className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex sm:hidden h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border sm:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>

              <div className="flex gap-2">
                {(["admin", "viewer"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setMenuOpen(false);
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                      role === r
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {r === "admin" ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
