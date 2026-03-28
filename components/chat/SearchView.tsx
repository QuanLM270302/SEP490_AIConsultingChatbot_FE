"use client";

import { useState } from "react";
import { Search, FileText, Calendar, Tag, ExternalLink, ChevronRight } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  department?: string;
  tags?: string[];
  lastUpdated: string;
  confidence?: number;
  documentId: string;
}

export function SearchView() {
  const { language } = useLanguageStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    
    // TODO: Replace with actual API call
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "Employee Handbook 2024",
          snippet: "This handbook contains all policies and procedures for employees including leave policies, work hours, and benefits...",
          department: "HR",
          tags: ["Policy", "HR"],
          lastUpdated: "2024-01-15",
          confidence: 0.95,
          documentId: "doc-001"
        },
        {
          id: "2",
          title: "IT Security Guidelines",
          snippet: "Security best practices for handling company data, password requirements, and access control procedures...",
          department: "IT",
          tags: ["Security", "IT"],
          lastUpdated: "2024-02-20",
          confidence: 0.88,
          documentId: "doc-002"
        },
        {
          id: "3",
          title: "Remote Work Policy",
          snippet: "Guidelines for remote work arrangements, equipment provision, and communication expectations...",
          department: "HR",
          tags: ["Policy", "Remote"],
          lastUpdated: "2024-03-10",
          confidence: 0.82,
          documentId: "doc-003"
        }
      ];
      setResults(mockResults);
      setIsSearching(false);
    }, 800);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="bg-emerald-500/20 text-emerald-400">{part}</mark>
        : part
    );
  };

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      {/* Search Header */}
      <div className="border-b border-white/10 bg-[#0b0b0c] px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-2xl font-bold text-white">
            {language === "en" ? "Search Knowledge Base" : "Tìm kiếm Kho tri thức"}
          </h1>
          <p className="text-sm text-zinc-400">
            {language === "en" 
              ? "Find documents, policies, and information across your organization" 
              : "Tìm tài liệu, chính sách và thông tin trong tổ chức"}
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-500/50 focus-within:bg-white/10">
              <Search className="h-5 w-5 text-zinc-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === "en" ? "Search company knowledge..." : "Tìm kiếm tri thức công ty..."}
                className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
              />
              <button
                type="submit"
                disabled={!query.trim() || isSearching}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
              >
                {isSearching 
                  ? (language === "en" ? "Searching..." : "Đang tìm...") 
                  : (language === "en" ? "Search" : "Tìm kiếm")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-1 overflow-hidden">
        {/* Results List */}
        <div className={`flex-1 overflow-y-auto p-6 ${selectedResult ? "lg:w-1/2" : ""}`}>
          <div className="mx-auto max-w-4xl">
            {results.length === 0 && !isSearching && (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <Search className="mx-auto h-12 w-12 text-zinc-600" />
                  <p className="mt-4 text-sm text-zinc-500">
                    {language === "en" 
                      ? "Enter a search query to find documents" 
                      : "Nhập từ khóa để tìm kiếm tài liệu"}
                  </p>
                </div>
              </div>
            )}

            {isSearching && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-6">
                    <div className="h-4 w-3/4 rounded bg-white/10"></div>
                    <div className="mt-3 h-3 w-full rounded bg-white/10"></div>
                    <div className="mt-2 h-3 w-2/3 rounded bg-white/10"></div>
                  </div>
                ))}
              </div>
            )}

            {results.length > 0 && !isSearching && (
              <div className="space-y-4">
                <div className="mb-4 text-sm text-zinc-400">
                  {language === "en" 
                    ? `Found ${results.length} results` 
                    : `Tìm thấy ${results.length} kết quả`}
                </div>
                
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => setSelectedResult(result)}
                    className="group w-full rounded-xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:border-emerald-500/50 hover:bg-white/10"
                  >
                    {/* Title */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400">
                          {highlightText(result.title, query)}
                        </h3>
                        
                        {/* Metadata */}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                          {result.department && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {result.department}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(result.lastUpdated).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                          </span>
                          {result.confidence && (
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-400">
                              {Math.round(result.confidence * 100)}% match
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <ChevronRight className="h-5 w-5 text-zinc-600 transition group-hover:text-emerald-400" />
                    </div>

                    {/* Snippet */}
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {highlightText(result.snippet, query)}
                    </p>

                    {/* Tags */}
                    {result.tags && result.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {result.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-xs text-zinc-400"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Document Preview Panel */}
        {selectedResult && (
          <div className="hidden w-1/2 border-l border-white/10 bg-[#0b0b0c] p-6 lg:block">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {language === "en" ? "Document Preview" : "Xem trước tài liệu"}
              </h2>
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                <ExternalLink className="h-5 w-5" />
              </button>
            </div>
            
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-bold text-white">{selectedResult.title}</h3>
              <div className="mt-4 space-y-4 text-sm text-zinc-300">
                <p>{selectedResult.snippet}</p>
                <p className="text-zinc-400">
                  {language === "en" 
                    ? "Full document preview would be displayed here..." 
                    : "Nội dung đầy đủ của tài liệu sẽ hiển thị ở đây..."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
