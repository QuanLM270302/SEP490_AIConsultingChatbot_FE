"use client";

import { useEffect, useState } from "react";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { getChatbotConfig, updateChatbotConfig, type ChatbotMode } from "@/lib/api/chatbot-config";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { Sparkles, ThumbsUp, ThumbsDown, MessageSquare, Star, AlertTriangle } from "lucide-react";

// Mock data for feedback (backend coming soon)
const mockFeedback = {
  totalMessages: 128,
  helpfulPercent: 72,
  notHelpfulPercent: 28,
};

const mockLowRated = [
  {
    question: "How do I apply for leave?",
    answer: "You can apply through the HR portal by navigating to the Leave section and filling out the request form with your desired dates.",
    sourceDocument: "Leave Policy 2026.pdf",
    rating: 1,
  },
  {
    question: "What is the dress code?",
    answer: "The company does not have a strict dress code but encourages professional attire during client meetings.",
    sourceDocument: "Company Rules 2026.pdf",
    rating: 2,
  },
];

export default function AIInsightsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  const [mode, setMode] = useState<ChatbotMode>("BALANCED");
  const [originalMode, setOriginalMode] = useState<ChatbotMode>("BALANCED");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    getChatbotConfig()
      .then((config) => {
        setMode(config.mode);
        setOriginalMode(config.mode);
        setError(null);
      })
      .catch(() => {
        setMode("BALANCED");
        setOriginalMode("BALANCED");
        setError(isEn ? "Failed to load config. Using default settings." : "Không tải được cấu hình. Sử dụng cài đặt mặc định.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isEn]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await updateChatbotConfig(mode);
      setOriginalMode(mode);
      setSuccessMessage(isEn ? "Chatbot behavior updated successfully" : "Cập nhật hành vi chatbot thành công");
    } catch (e) {
      setError(e instanceof Error ? e.message : isEn ? "Failed to update. Please try again." : "Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = mode !== originalMode;

  return (
    <TenantAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {isEn ? "AI Insights" : "Thông tin AI"}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            {isEn ? "Configure chatbot behavior and view performance metrics" : "Cấu hình hành vi chatbot và xem số liệu hiệu suất"}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Chatbot Behavior */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {isEn ? "Chatbot Behavior" : "Hành vi Chatbot"}
            </h2>
          </div>
          <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            {isEn ? "Control how the AI retrieves answers for your company" : "Kiểm soát cách AI truy xuất câu trả lời cho công ty bạn"}
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Balanced */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-4 transition hover:border-purple-300 hover:bg-purple-50/50 dark:border-zinc-700 dark:hover:border-purple-700 dark:hover:bg-purple-950/20">
                <input
                  type="radio"
                  name="chatbot-mode"
                  value="BALANCED"
                  checked={mode === "BALANCED"}
                  onChange={(e) => setMode(e.target.value as ChatbotMode)}
                  disabled={loading || saving}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {isEn ? "Balanced" : "Cân bằng"}
                    </span>
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                      {isEn ? "Recommended" : "Khuyến nghị"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {isEn ? "Best for most cases. Reliable answers." : "Tốt nhất cho hầu hết trường hợp. Câu trả lời đáng tin cậy."}
                  </p>
                </div>
              </label>

              {/* Strict */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-4 transition hover:border-purple-300 hover:bg-purple-50/50 dark:border-zinc-700 dark:hover:border-purple-700 dark:hover:bg-purple-950/20">
                <input
                  type="radio"
                  name="chatbot-mode"
                  value="STRICT"
                  checked={mode === "STRICT"}
                  onChange={(e) => setMode(e.target.value as ChatbotMode)}
                  disabled={loading || saving}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {isEn ? "Strict" : "Nghiêm ngặt"}
                  </span>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {isEn ? "More accurate. Only answers when confident." : "Chính xác hơn. Chỉ trả lời khi tự tin."}
                  </p>
                </div>
              </label>

              {/* Flexible */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-4 transition hover:border-purple-300 hover:bg-purple-50/50 dark:border-zinc-700 dark:hover:border-purple-700 dark:hover:bg-purple-950/20">
                <input
                  type="radio"
                  name="chatbot-mode"
                  value="FLEXIBLE"
                  checked={mode === "FLEXIBLE"}
                  onChange={(e) => setMode(e.target.value as ChatbotMode)}
                  disabled={loading || saving}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {isEn ? "Flexible" : "Linh hoạt"}
                  </span>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {isEn ? "Answers more broadly. May include less relevant info." : "Trả lời rộng hơn. Có thể bao gồm thông tin ít liên quan."}
                  </p>
                </div>
              </label>

              <button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (isEn ? "Saving..." : "Đang lưu...") : (isEn ? "Save Settings" : "Lưu cài đặt")}
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Feedback Summary */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            {isEn ? "Feedback Summary" : "Tóm tắt phản hồi"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {mockFeedback.helpfulPercent}%
                </span>
              </div>
              <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                {isEn ? "Helpful" : "Hữu ích"}
              </p>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
              <div className="flex items-center gap-2">
                <ThumbsDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {mockFeedback.notHelpfulPercent}%
                </span>
              </div>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {isEn ? "Not Helpful" : "Không hữu ích"}
              </p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {mockFeedback.totalMessages}
                </span>
              </div>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                {isEn ? "Total Messages" : "Tổng tin nhắn"}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Low Rated Responses */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            {isEn ? "Low Rated Responses" : "Phản hồi đánh giá thấp"}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {isEn ? "Question" : "Câu hỏi"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {isEn ? "Answer" : "Câu trả lời"}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {isEn ? "Source Document" : "Tài liệu nguồn"}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {isEn ? "Rating" : "Đánh giá"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {mockLowRated.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      item.rating === 1
                        ? "bg-red-50/50 dark:bg-red-950/20"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">
                      <div className="max-w-xs truncate" title={item.question}>
                        {item.question.length > 60 ? `${item.question.slice(0, 60)}...` : item.question}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                      <div className="max-w-md truncate" title={item.answer}>
                        {item.answer.length > 80 ? `${item.answer.slice(0, 80)}...` : item.answer}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                      {item.sourceDocument}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TenantAdminLayout>
  );
}
