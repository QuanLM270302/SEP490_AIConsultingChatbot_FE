"use client";

import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { Search, Shield, Database, ArrowRight, CheckCircle2, Moon, Sun, Sparkles, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppTheme } from "@/lib/use-app-theme";
import { getAccessToken, getStoredUser } from "@/lib/auth-store";
import { roleToPath } from "@/lib/auth-routes";
import { useLanguageStore } from "@/lib/language-store";
import { AppLogo } from "@/components/brand/AppLogo";

const RAG_FLOW_ICONS = [Search, Database, Shield, Sparkles] as const;

export default function Home() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [qaIndex, setQaIndex] = useState(0);
  const [ragStepIndex, setRagStepIndex] = useState(0);
  const [isRagFlowInView, setIsRagFlowInView] = useState(false);
  const [ragAnimatedIcons, setRagAnimatedIcons] = useState<Record<number, object>>({});
  const { theme, toggleTheme: toggleAppTheme } = useAppTheme();
  const { language, setLanguage } = useLanguageStore();
  const [themeReady, setThemeReady] = useState(false);
  const isEn = language === "en";

  const homeText = useMemo(
    () =>
      isEn
        ? {
            brand: "Internal Consultant AI",
            applyNow: "Apply Now",
            signIn: "Sign in",
            switchToLight: "Switch to light mode",
            switchToDark: "Switch to dark mode",
            findAnything: "Find anything.",
            answerEverything: "Answer everything",
            insideCompany: "inside your company.",
            heroDescription:
              "AI-powered search across internal documents with secure, permission-aware answers. Get instant insights from your company Document Dashboard.",
            askAnything: "Ask anything...",
            ask: "Ask",
            sources: "Sources:",
            featureHeading: "Everything you need",
            featureDescription:
              "Powerful features to transform your internal knowledge management",
            ctaTitle: "Ready to transform your knowledge management?",
            ctaDescription:
              "Join companies using AI to make internal knowledge accessible to everyone.",
            getStarted: "Get started",
            copyright: "© 2026 Internal Consultant AI. All rights reserved.",
            ragBadge: "Live RAG Flow",
            ragTitle: "How The RAG Chatbot Works In 4 Steps",
            ragDescription:
              "Watch the pipeline move from user query to grounded answer with trusted sources.",
            ragStatusRunning: "Running",
            ragStatusDone: "Done",
            ragStatusWaiting: "Waiting",
            ragLoopHint: "This flow loops continuously from step 4 back to step 1.",
            ragSteps: [
              {
                title: "Receive user question",
                desc: "The chatbot captures intent and key entities from the prompt.",
              },
              {
                title: "Retrieve relevant knowledge",
                desc: "Semantic search pulls top matching chunks from internal documents.",
              },
              {
                title: "Filter by permissions",
                desc: "Only chunks allowed by role, tenant, and policy continue to context.",
              },
              {
                title: "Generate grounded answer",
                desc: "The model drafts a response with citations tied to retrieved evidence.",
              },
            ],
            features: [
              {
                title: "AI-powered search",
                desc: "Find answers instantly from your Document Dashboard with natural language queries",
              },
              {
                title: "Document system",
                desc: "Upload, version, and manage documents with full-text search and categorization",
              },
              {
                title: "Permission-aware",
                desc: "Respect roles, tenants and access control. Only see what you're allowed to see",
              },
            ],
          }
        : {
            brand: "Internal Consultant AI",
            applyNow: "Đăng ký",
            signIn: "Đăng nhập",
            switchToLight: "Chuyển sang chế độ sáng",
            switchToDark: "Chuyển sang chế độ tối",
            findAnything: "Tìm mọi thứ.",
            answerEverything: "Trả lời mọi câu hỏi",
            insideCompany: "trong công ty của bạn.",
            heroDescription:
              "Tìm kiếm thông minh trên tài liệu nội bộ với câu trả lời an toàn theo quyền truy cập. Nhận thông tin nhanh từ Bảng điều khiển tài liệu của doanh nghiệp.",
            askAnything: "Đặt câu hỏi bất kỳ...",
            ask: "Hỏi",
            sources: "Nguồn:",
            featureHeading: "Mọi thứ bạn cần",
            featureDescription:
              "Tính năng mạnh mẽ giúp tối ưu quản lý tri thức nội bộ",
            ctaTitle: "Sẵn sàng nâng cấp hệ thống tri thức nội bộ?",
            ctaDescription:
              "Tham gia cùng các doanh nghiệp đang ứng dụng AI để mở rộng khả năng tiếp cận tri thức cho mọi nhân viên.",
            getStarted: "Bắt đầu",
            copyright: "© 2026 Internal Consultant AI. Bảo lưu mọi quyền.",
            ragBadge: "Luồng RAG trực quan",
            ragTitle: "RAG chatbot vận hành qua 4 bước",
            ragDescription:
              "Theo dõi pipeline chạy từ câu hỏi người dùng đến câu trả lời có dẫn nguồn.",
            ragStatusRunning: "Đang xử lý",
            ragStatusDone: "Hoàn tất",
            ragStatusWaiting: "Đang chờ",
            ragLoopHint: "Luồng chạy tuần hoàn: bước 4 quay lại bước 1.",
            ragSteps: [
              {
                title: "Nhận câu hỏi người dùng",
                desc: "Chatbot tiếp nhận ý định và các thực thể quan trọng từ câu hỏi.",
              },
              {
                title: "Truy xuất tri thức liên quan",
                desc: "Tìm kiếm ngữ nghĩa lấy các đoạn tài liệu phù hợp nhất từ kho nội bộ.",
              },
              {
                title: "Lọc theo quyền truy cập",
                desc: "Chỉ các đoạn dữ liệu đúng vai trò, tenant và chính sách mới được đưa vào ngữ cảnh.",
              },
              {
                title: "Sinh câu trả lời có căn cứ",
                desc: "Mô hình tạo phản hồi dựa trên dữ liệu truy xuất và gắn dẫn nguồn rõ ràng.",
              },
            ],
            features: [
              {
                title: "Tìm kiếm bằng AI",
                desc: "Tìm câu trả lời ngay lập tức từ Bảng điều khiển tài liệu bằng ngôn ngữ tự nhiên",
              },
              {
                title: "Hệ thống tài liệu",
                desc: "Tải lên, quản lý phiên bản và sắp xếp tài liệu với tìm kiếm toàn văn",
              },
              {
                title: "Phân quyền thông minh",
                desc: "Tôn trọng vai trò, tenant và kiểm soát truy cập. Bạn chỉ thấy nội dung được phép xem",
              },
            ],
          },
    [isEn]
  );

  const qaData = useMemo(
    () =>
      isEn
        ? [
            {
              question: "What is the leave policy?",
              answer:
                "Employees are entitled to 12 days of annual leave per year. Additional leave may be granted based on tenure and company policy.",
              sources: ["HR Policy v2.1", "Employee Handbook"],
            },
            {
              question: "How do I submit an expense report?",
              answer:
                "Submit expense reports through the Finance Portal within 30 days of purchase. Include receipts and proper categorization for approval.",
              sources: ["Finance Guidelines", "Expense Policy 2026"],
            },
            {
              question: "What are the working hours?",
              answer:
                "Standard working hours are 9:00 AM to 6:00 PM, Monday to Friday. Flexible hours available with manager approval.",
              sources: ["Employee Handbook", "Work Schedule Policy"],
            },
            {
              question: "How to request remote work?",
              answer:
                "Remote work requests must be submitted via HR Portal at least 48 hours in advance. Maximum 2 days per week for eligible roles.",
              sources: ["Remote Work Policy", "HR Guidelines 2026"],
            },
          ]
        : [
            {
              question: "Chính sách nghỉ phép như thế nào?",
              answer:
                "Nhân viên được hưởng 12 ngày nghỉ phép năm mỗi năm. Có thể được xét thêm tùy theo thâm niên và chính sách công ty.",
              sources: ["Chính sách Nhân sự v2.1", "Sổ tay Nhân viên"],
            },
            {
              question: "Làm sao để nộp báo cáo chi phí?",
              answer:
                "Nộp báo cáo chi phí trên cổng Finance trong vòng 30 ngày sau mua sắm. Đính kèm hóa đơn và phân loại đúng để duyệt.",
              sources: ["Hướng dẫn Tài chính", "Chính sách Chi phí 2026"],
            },
            {
              question: "Giờ làm việc quy định là gì?",
              answer:
                "Giờ làm việc tiêu chuẩn là 9:00 đến 18:00, thứ Hai đến thứ Sáu. Có thể linh hoạt nếu được quản lý phê duyệt.",
              sources: ["Sổ tay Nhân viên", "Chính sách Lịch làm việc"],
            },
            {
              question: "Cách đề xuất làm việc từ xa?",
              answer:
                "Gửi yêu cầu qua cổng HR trước ít nhất 48 giờ. Tối đa 2 ngày mỗi tuần cho các vị trí đủ điều kiện.",
              sources: ["Chính sách Làm việc từ xa", "Hướng dẫn HR 2026"],
            },
          ],
    [isEn]
  );

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
  }, [qaData, qaIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setQaIndex((prev) => (prev + 1) % qaData.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [qaData.length]);

  useEffect(() => {
    if (!isRagFlowInView) return;

    const timer = setInterval(() => {
      setRagStepIndex((prev) => (prev + 1) % homeText.ragSteps.length);
    }, 3600);

    return () => clearInterval(timer);
  }, [homeText.ragSteps.length, isRagFlowInView]);

  useEffect(() => {
    setRagStepIndex(0);
  }, [language]);

  useEffect(() => {
    let cancelled = false;

    const loadRagIcons = async () => {
      const iconSources: Array<[number, string]> = [
        [0, "/lottie/yellow-quiz.json"],
        [1, "/lottie/searching.json"],
        [2, "/lottie/security-shield.json"],
        [3, "/lottie/ai-step4.json"],
      ];

      const loadedIcons = await Promise.all(
        iconSources.map(async ([index, path]) => {
          try {
            const response = await fetch(path);
            if (!response.ok) return null;

            const data = (await response.json()) as object;
            return [index, data] as const;
          } catch {
            return null;
          }
        })
      );

      if (cancelled) return;

      const nextIcons: Record<number, object> = {};
      loadedIcons.forEach((entry) => {
        if (entry) {
          nextIcons[entry[0]] = entry[1];
        }
      });

      setRagAnimatedIcons(nextIcons);
    };

    void loadRagIcons();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setThemeReady(true);
  }, []);

  const toggleTheme = () => {
    toggleAppTheme();
  };

  const currentQA = qaData[qaIndex];

  return (
    <div className="relative min-h-screen overflow-hidden transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
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
        <div className="mx-auto flex w-full max-w-7xl min-w-0 items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <AppLogo size={30} />
            <h1 className="max-w-[8.5rem] truncate text-xs font-bold leading-tight tracking-tight text-zinc-900 sm:max-w-none sm:text-base dark:text-zinc-50">
              {homeText.brand}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2.5">
            <div className="relative inline-flex items-center rounded-lg border border-zinc-300/90 bg-white/95 p-0.5 shadow-sm dark:border-zinc-700/90 dark:bg-zinc-800/90 sm:rounded-xl sm:p-1">
              <motion.span
                aria-hidden
                layout
                transition={{ type: "spring", stiffness: 210, damping: 26, mass: 1.05 }}
                className={`pointer-events-none absolute bottom-1 top-1 w-[calc(50%-0.25rem)] rounded-md bg-emerald-500 shadow-sm ${
                  isEn ? "left-1" : "left-[calc(50%+0.125rem)]"
                }`}
              />
              <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={isEn}
                className={`relative z-10 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-3 sm:text-xs ${
                  isEn
                    ? "text-white"
                    : "text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("vi")}
                aria-pressed={!isEn}
                className={`relative z-10 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-3 sm:text-xs ${
                  !isEn
                    ? "text-white"
                    : "text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100"
                }`}
              >
                VI
              </button>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? homeText.switchToLight : homeText.switchToDark}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white p-2 text-zinc-700 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 sm:rounded-xl"
            >
              <motion.span
                key={themeReady && theme === "dark" ? "sun" : "moon"}
                initial={{ rotate: -30, opacity: 0, scale: 0.82 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 30, opacity: 0, scale: 0.82 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex"
              >
                {themeReady && theme === "dark" ? (
                  <Sun className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                )}
              </motion.span>
            </button>
            <Link
              href="/register"
              className="hidden rounded-lg border border-zinc-300 bg-white px-2.5 py-2 text-[11px] font-medium leading-none text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 sm:inline-flex sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
            >
              {homeText.applyNow}
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-emerald-500 px-2.5 py-2 text-[11px] font-medium leading-none text-white shadow-md shadow-emerald-500/25 transition hover:bg-emerald-600 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm sm:shadow-lg sm:shadow-emerald-500/30"
            >
              {homeText.signIn}
            </Link>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
      <motion.div
        key={language}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      >
      {/* HERO SECTION */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center px-6 py-16 text-center sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-6xl lg:text-7xl">
            {homeText.findAnything}{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {homeText.answerEverything}
            </span>
            <br />
            {homeText.insideCompany}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            {homeText.heroDescription}
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
                  placeholder={homeText.askAnything}
                  className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-400 outline-none dark:text-zinc-50"
                />
                <button className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600">
                  {homeText.ask}
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
                    <span>{homeText.sources}</span>
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

      {/* RAG FLOW SECTION */}
      <motion.section
        onViewportEnter={() => setIsRagFlowInView(true)}
        onViewportLeave={() => setIsRagFlowInView(false)}
        viewport={{ amount: 0.25 }}
        className="relative z-10 border-t border-zinc-200/40 py-20 dark:border-zinc-800/40"
      >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center rounded-full border border-emerald-300/70 bg-emerald-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-900/35 dark:text-emerald-300">
            {homeText.ragBadge}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {homeText.ragTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-zinc-600 dark:text-zinc-400">
            {homeText.ragDescription}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-4 lg:gap-8">
          {homeText.ragSteps.map((step, index) => {
            const Icon = RAG_FLOW_ICONS[index] ?? Search;
            const isActive = isRagFlowInView && ragStepIndex === index;
            const isDone = isRagFlowInView && ragStepIndex > index;
            const animatedIconData = ragAnimatedIcons[index];
            const useLottieIcon = animatedIconData !== undefined;

            return (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={
                  isActive
                    ? { y: -5, scale: 1.01, boxShadow: "0 14px 40px rgba(16,185,129,0.22)" }
                    : { y: 0, scale: 1, boxShadow: "0 8px 28px rgba(15,23,42,0.08)" }
                }
                whileHover={{ y: -2 }}
                transition={{ delay: index * 0.08, type: "spring", stiffness: 120, damping: 18, mass: 0.85 }}
                className="relative overflow-visible rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-zinc-100 px-2 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {index + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      isActive
                        ? "bg-emerald-500 text-white"
                        : isDone
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    } transition-colors duration-500`}
                  >
                    {isActive
                      ? homeText.ragStatusRunning
                      : isDone
                        ? homeText.ragStatusDone
                        : homeText.ragStatusWaiting}
                  </span>
                </div>

                <motion.div
                  animate={
                    isActive
                      ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: isActive ? 1.65 : 0.45, repeat: isActive ? Infinity : 0, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-5 flex w-full items-center justify-center text-emerald-600 dark:text-emerald-300"
                >
                  {useLottieIcon ? (
                    <Lottie
                      key={`${index}-${isActive ? "active" : "idle"}`}
                      animationData={animatedIconData}
                      loop={isActive}
                      autoplay={isActive}
                      className="h-28 w-28 sm:h-32 sm:w-32"
                    />
                  ) : (
                    <Icon className="h-14 w-14 sm:h-16 sm:w-16" />
                  )}
                </motion.div>

                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{step.desc}</p>

                {index < homeText.ragSteps.length - 1 && (
                  <motion.div
                    animate={isRagFlowInView ? { x: [-10, 0, 10], opacity: [0.2, 1, 0.2] } : { x: 0, opacity: 0.2 }}
                    transition={{ duration: 3.2, repeat: isRagFlowInView ? Infinity : 0, ease: [0.22, 1, 0.36, 1], delay: index * 0.4 }}
                    className="pointer-events-none absolute -right-7 top-1/2 hidden -translate-y-1/2 text-emerald-500 md:block lg:-right-9"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                )}
              </motion.article>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-300">
          <motion.span
            animate={isRagFlowInView ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={{ duration: 4.2, repeat: isRagFlowInView ? Infinity : 0, ease: "linear" }}
            className="inline-flex"
          >
            <RefreshCcw className="h-4 w-4" />
          </motion.span>
          <p className="text-xs font-medium">{homeText.ragLoopHint}</p>
        </div>
      </div>
      </motion.section>

      {/* FEATURES SECTION */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {homeText.featureHeading}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {homeText.featureDescription}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Search className="h-6 w-6" />,
              title: homeText.features[0].title,
              desc: homeText.features[0].desc,
              color: "emerald",
            },
            {
              icon: <Database className="h-6 w-6" />,
              title: homeText.features[1].title,
              desc: homeText.features[1].desc,
              color: "teal",
            },
            {
              icon: <Shield className="h-6 w-6" />,
              title: homeText.features[2].title,
              desc: homeText.features[2].desc,
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
            {homeText.ctaTitle}
          </h2>
          <p className="mb-8 text-emerald-50">
            {homeText.ctaDescription}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-medium text-emerald-600 shadow-xl transition hover:scale-105"
          >
            {homeText.getStarted}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-zinc-200 bg-white/50 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {homeText.copyright}
        </div>
      </footer>
      </motion.div>
      </AnimatePresence>
    </div>
  );
}

