"use client";

import { motion } from "framer-motion";
import { Search, Shield, Database, Sparkles, ArrowRight, CheckCircle2, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { applyTheme, onThemeChange, resolveTheme, toggleTheme as toggleThemeMode, type ThemeMode } from "@/lib/theme";
import { getAccessToken, getStoredUser } from "@/lib/auth-store";
import { roleToPath } from "@/lib/auth-routes";

export default function Home() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [qaIndex, setQaIndex] = useState(0);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [themeReady, setThemeReady] = useState(false);

  const qaData = [
    {
      question: "What is the leave policy?",
      answer: "Employees are entitled to 12 days of annual leave per year. Additional leave may be granted based on tenure and company policy.",
      sources: ["HR Policy v2.1", "Employee Handbook"],
    },
    {
      question: "How do I submit an expense report?",
      answer: "Submit expense reports through the Finance Portal within 30 days of purchase. Include receipts and proper categorization for approval.",
      sources: ["Finance Guidelines", "Expense Policy 2026"],
    },
    {
      question: "What are the working hours?",
      answer: "Standard working hours are 9:00 AM to 6:00 PM, Monday to Friday. Flexible hours available with manager approval.",
      sources: ["Employee Handbook", "Work Schedule Policy"],
    },
    {
      question: "How to request remote work?",
      answer: "Remote work requests must be submitted via HR Portal at least 48 hours in advance. Maximum 2 days per week for eligible roles.",
      sources: ["Remote Work Policy", "HR Guidelines 2026"],
    },
    {
      question: "What is the dress code policy?",
      answer: "Business casual attire is standard. Casual Fridays allow jeans and sneakers. Client-facing roles require business formal.",
      sources: ["Workplace Guidelines", "Employee Handbook"],
    },
    {
      question: "How do I access the VPN?",
      answer: "Download the company VPN client from IT Portal. Use your employee credentials and 2FA for secure access to internal systems.",
      sources: ["IT Security Guide", "VPN Setup Manual"],
    },
    {
      question: "What are the health insurance benefits?",
      answer: "Full-time employees receive comprehensive health insurance covering medical, dental, and vision. Coverage starts after 90-day probation.",
      sources: ["Benefits Package 2026", "Insurance Policy"],
    },
    {
      question: "How to book a meeting room?",
      answer: "Book meeting rooms through the Office Portal or Outlook calendar. Rooms available 8 AM - 7 PM. Cancel if unused to free up space.",
      sources: ["Office Management Guide", "Booking System Manual"],
    },
  ];

  useEffect(() => {
    const token = getAccessToken();
    const user = getStoredUser();
    if (token && user?.roles?.length) {
      router.replace(roleToPath(user.roles));
    }
  }, [router]);

  useEffect(() => {
    const currentQA = qaData[qaIndex];
    if (!currentQA) return;

    setText("");
    let i = 0;
    const interval = setInterval(() => {
      setText(currentQA.question.slice(0, i));
      i++;
      if (i > currentQA.question.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [qaIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setQaIndex((prev) => (prev + 1) % qaData.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [qaData.length]);

  useEffect(() => {
    const currentTheme = resolveTheme();
    applyTheme(currentTheme);
    setTheme(currentTheme);
    setThemeReady(true);

    return onThemeChange((nextTheme) => {
      setTheme(nextTheme);
    });
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => toggleThemeMode(prevTheme));
  };

  const currentQA = qaData[qaIndex];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ANIMATED GRADIENT BACKGROUND */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-zinc-50 via-white to-emerald-50/30 dark:from-zinc-950 dark:via-black dark:to-emerald-950/20" />
      
      {/* GRID PATTERN */}
      <motion.div
        animate={{ backgroundPosition: ["0px 0px", "24px 24px"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0f172a1f_1px,transparent_1px),linear-gradient(to_bottom,#0f172a1f_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#10b9812e_1px,transparent_1px),linear-gradient(to_bottom,#10b9812e_1px,transparent_1px)]"
      />
      
      {/* DOT PATTERN - Top Right */}
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] opacity-55 dark:opacity-45">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#10b98120_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      
      {/* DOT PATTERN - Bottom Left */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] opacity-55 dark:opacity-45">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#10b98120_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* ANIMATED GRADIENT ORBS */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 bg-emerald-500/15 blur-[120px] dark:bg-emerald-500/10" />
      
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-teal-500/22 blur-[95px] mix-blend-multiply dark:bg-teal-500/16 dark:mix-blend-screen"
      />
      
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-[10%] left-[15%] h-[350px] w-[350px] rounded-full bg-cyan-500/20 blur-[95px] mix-blend-multiply dark:bg-cyan-500/15 dark:mix-blend-screen"
      />
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[85vh] w-[85vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-65 blur-3xl mix-blend-multiply dark:opacity-50 dark:mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(16,185,129,0.18), rgba(20,184,166,0.16), rgba(6,182,212,0.18), rgba(16,185,129,0.18))",
        }}
      />
      <motion.div
        animate={{
          x: [0, 24, 0, -24, 0],
          y: [0, -18, 0, 18, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute inset-0 opacity-55 dark:opacity-42"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(16,185,129,0.22), transparent 35%), radial-gradient(circle at 80% 35%, rgba(20,184,166,0.2), transparent 40%), radial-gradient(circle at 30% 80%, rgba(6,182,212,0.18), transparent 42%)",
        }}
      />

      {/* NAVBAR — một hàng mọi kích thước; chữ/nút scale theo màn hình */}
      <nav className="relative z-10 border-b border-zinc-200/50 bg-white/50 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/50">
        <div className="mx-auto flex max-w-7xl flex-nowrap items-center justify-between gap-2 overflow-x-auto px-3 py-3.5 [scrollbar-width:none] sm:gap-4 sm:px-6 sm:py-4 md:overflow-visible [&::-webkit-scrollbar]:hidden">
          <h1 className="shrink-0 whitespace-nowrap text-[clamp(0.6875rem,0.4rem+3.2vw,1.5rem)] font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
            Internal Consultant AI
          </h1>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white p-2 text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 sm:rounded-xl"
            >
              {themeReady && theme === "dark" ? (
                <Sun className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              )}
            </button>
            <Link
              href="/register"
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-2 text-[11px] font-medium leading-none text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
            >
              Apply Now
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-emerald-500 px-3 py-2 text-[11px] font-medium leading-none text-white shadow-md shadow-emerald-500/25 transition hover:bg-emerald-600 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm sm:shadow-lg sm:shadow-emerald-500/30"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-6xl lg:text-7xl">
            Find anything.{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Answer everything
            </span>
            <br />
            inside your company.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            AI-powered search across internal documents with secure, permission-aware answers.
            Get instant insights from your company knowledge base.
          </p>

          {/* SEARCH BAR DEMO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto max-w-3xl"
          >
            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-emerald-500/10 transition-all duration-300 hover:shadow-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <Search className="h-5 w-5 text-zinc-400" />
                <input
                  value={text}
                  readOnly
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-400 outline-none dark:text-zinc-50"
                />
                <button className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600">
                  Ask
                </button>
              </div>

              {/* AI RESPONSE DEMO */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: text.length === currentQA.question.length ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 p-6"
              >
                <div className="rounded-2xl bg-emerald-500/10 p-4 text-left">
                  <p className="text-sm text-zinc-900 dark:text-zinc-50">
                    {currentQA.answer}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Sources:</span>
                    {currentQA.sources.map((source, idx) => (
                      <span key={idx} className="rounded-lg bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* FEATURES SECTION */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Everything you need
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Powerful features to transform your internal knowledge management
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Search className="h-6 w-6" />,
              title: "AI-powered search",
              desc: "Find answers instantly from internal knowledge base with natural language queries",
              color: "emerald",
            },
            {
              icon: <Database className="h-6 w-6" />,
              title: "Document system",
              desc: "Upload, version, and manage documents with full-text search and categorization",
              color: "teal",
            },
            {
              icon: <Shield className="h-6 w-6" />,
              title: "Permission-aware",
              desc: "Respect roles, tenants and access control. Only see what you're allowed to see",
              color: "cyan",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="group h-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-900/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:animate-pulse-glow dark:text-emerald-400">
                  {item.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-12 text-center shadow-2xl shadow-emerald-500/30"
        >
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to transform your knowledge management?
          </h2>
          <p className="mb-8 text-emerald-50">
            Join companies using AI to make internal knowledge accessible to everyone.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-medium text-emerald-600 shadow-xl transition hover:scale-105"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-zinc-200 bg-white/50 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          © 2026 Internal Consultant AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

