"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import {
  Search,
  Sparkles,
  Filter,
  MapPin,
  Building2,
  Calendar,
  IndianRupee,
  ChevronRight,
  RefreshCw,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

interface Tender {
  id: string;
  referenceNumber: string;
  title: string;
  description?: string;
  organization: string;
  category: string;
  state?: string;
  city?: string;
  estimatedValue?: number;
  currency: string;
  tenderType: "GOODS" | "WORKS" | "SERVICES" | "CONSULTANCY";
  submissionDeadline: string;
  publishedAt?: string;
  status: "ACTIVE" | "CLOSED" | "ARCHIVED";
}

interface FilterOptions {
  categories: string[];
  states: string[];
}

interface AIIntentMeta {
  query?: string;
  category?: string;
  state?: string;
  tenderType?: string;
  status?: string;
  minEstimatedValue?: number;
  maxEstimatedValue?: number;
}

export default function TenderDiscoveryPage() {
  // Search & Mode state
  const [searchMode, setSearchMode] = useState<"standard" | "ai">("ai");
  const [searchInput, setSearchInput] = useState("");
  const [aiQueryInput, setAiQueryInput] = useState("");

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [minBudget, setMinBudget] = useState<string>("");
  const [maxBudget, setMaxBudget] = useState<string>("");

  // Data & Pagination state
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ categories: [], states: [] });
  const [aiIntentMeta, setAiIntentMeta] = useState<AIIntentMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch filter options on mount
  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await fetch("/api/tenders/options");
        const json = await res.json();
        if (json.success) {
          setFilterOptions(json.data);
        }
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    }
    fetchOptions();
  }, []);

  // Fetch tenders handler
  const fetchTenders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "9");

      if (searchMode === "ai" && aiQueryInput.trim()) {
        params.set("aiQuery", aiQueryInput.trim());
      } else if (searchMode === "standard" && searchInput.trim()) {
        params.set("search", searchInput.trim());
      }

      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedState) params.set("state", selectedState);
      if (selectedType) params.set("tenderType", selectedType);
      if (minBudget) params.set("minEstimatedValue", minBudget);
      if (maxBudget) params.set("maxEstimatedValue", maxBudget);

      const res = await fetch(`/api/tenders?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setTenders(json.data);
        setTotalPages(json.meta?.totalPages || 1);
        setTotalCount(json.meta?.totalCount || 0);
        setAiIntentMeta(json.meta?.aiIntent || null);
      } else {
        setError(json.error?.message || "Failed to load tenders.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [page, searchMode, aiQueryInput, searchInput, selectedCategory, selectedState, selectedType, minBudget, maxBudget]);

  useEffect(() => {
    fetchTenders();
  }, [fetchTenders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTenders();
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setAiQueryInput("");
    setSelectedCategory("");
    setSelectedState("");
    setSelectedType("");
    setMinBudget("");
    setMaxBudget("");
    setPage(1);
    setAiIntentMeta(null);
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Crore`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getDaysRemaining = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-900/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Procurement Intelligence Platform
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Government Tender Discovery
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
                Explore, filter, and discover active tender opportunities using precise criteria or natural language AI intent search.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/80 p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setSearchMode("ai")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  searchMode === "ai"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Natural Search
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("standard")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  searchMode === "standard"
                    ? "bg-slate-800 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                Standard Keywords
              </button>
            </div>
          </div>

          {/* Search Box Form */}
          <form onSubmit={handleSearchSubmit} className="mt-6">
            <div className="relative flex items-center rounded-2xl border border-slate-700/80 bg-slate-950/90 shadow-2xl focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
              <div className="pl-4 text-slate-400">
                {searchMode === "ai" ? <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" /> : <Search className="h-5 w-5 text-slate-400" />}
              </div>
              <input
                type="text"
                value={searchMode === "ai" ? aiQueryInput : searchInput}
                onChange={(e) => (searchMode === "ai" ? setAiQueryInput(e.target.value) : setSearchInput(e.target.value))}
                placeholder={
                  searchMode === "ai"
                    ? 'Try: "Solar farm construction tenders in Rajasthan over 50 Lakhs"'
                    : "Search by tender title, reference number, organization, or keywords..."
                }
                className="w-full bg-transparent px-4 py-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <div className="pr-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Search</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* AI Search Example Pill Prompt Suggestions */}
          {searchMode === "ai" && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-500">Popular AI Prompts:</span>
              {[
                "Civil works tenders in Delhi above 1 Crore",
                "Hospital equipment supply in Maharashtra",
                "IT consulting tenders for smart city",
              ].map((promptText) => (
                <button
                  key={promptText}
                  type="button"
                  onClick={() => {
                    setAiQueryInput(promptText);
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition"
                >
                  {promptText}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content Body */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter Options */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl backdrop-blur-sm sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-base">
                  <Filter className="h-4 w-4 text-blue-400" />
                  <span>Refine Filters</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-slate-400 hover:text-blue-400 transition"
                >
                  Reset all
                </button>
              </div>

              <div className="space-y-5">
                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Category / Industry
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    {filterOptions.categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    State / Region
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">All States</option>
                    {filterOptions.states.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tender Type Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Tender Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["WORKS", "GOODS", "SERVICES", "CONSULTANCY"].map((tType) => (
                      <button
                        key={tType}
                        type="button"
                        onClick={() => {
                          setSelectedType(selectedType === tType ? "" : tType);
                          setPage(1);
                        }}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition text-center ${
                          selectedType === tType
                            ? "border-blue-500 bg-blue-500/20 text-blue-300"
                            : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        {tType}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimated Budget Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Min Budget (INR)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="number"
                      placeholder="e.g. 5000000"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Max Budget (INR)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="number"
                      placeholder="e.g. 50000000"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Tender Cards Grid */}
          <section className="lg:col-span-3 space-y-6">
            {/* AI Intent Metadata Badge */}
            {aiIntentMeta && Object.keys(aiIntentMeta).length > 0 && (
              <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 to-slate-900/60 p-4 shadow-lg flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                <div className="text-xs sm:text-sm text-slate-300">
                  <span className="font-semibold text-indigo-300">AI Intent Detected: </span>
                  Parsed query criteria:{" "}
                  {aiIntentMeta.state && <span className="font-medium text-white">State: {aiIntentMeta.state} • </span>}
                  {aiIntentMeta.category && <span className="font-medium text-white">Category: {aiIntentMeta.category} • </span>}
                  {aiIntentMeta.tenderType && <span className="font-medium text-white">Type: {aiIntentMeta.tenderType} • </span>}
                  {aiIntentMeta.minEstimatedValue && (
                    <span className="font-medium text-white">Min: {formatCurrency(aiIntentMeta.minEstimatedValue)} • </span>
                  )}
                  {aiIntentMeta.query && <span className="font-medium text-white">Keyword: &quot;{aiIntentMeta.query}&quot;</span>}
                </div>
              </div>
            )}

            {/* Results Count Summary */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 border-b border-slate-800 pb-3">
              <div>
                Showing <span className="font-semibold text-white">{tenders.length}</span> of{" "}
                <span className="font-semibold text-white">{totalCount}</span> tenders
              </div>
              <div>Page {page} of {totalPages}</div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-sm text-red-400 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-6 space-y-4">
                    <div className="h-4 w-1/3 bg-slate-800 rounded" />
                    <div className="h-6 w-3/4 bg-slate-800 rounded" />
                    <div className="h-4 w-1/2 bg-slate-800 rounded" />
                    <div className="h-10 w-full bg-slate-800 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : tenders.length === 0 ? (
              /* Empty State */
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
                <FileSpreadsheet className="h-12 w-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-semibold text-slate-300">No tenders found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  We couldn&apos;t find any tenders matching your search criteria. Try clearing filters or refining your search prompt.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset Search Filters
                </button>
              </div>
            ) : (
              /* Tenders Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {tenders.map((tender) => {
                  const daysLeft = getDaysRemaining(tender.submissionDeadline);
                  const isUrgent = daysLeft > 0 && daysLeft <= 7;

                  return (
                    <div
                      key={tender.id}
                      className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg hover:border-blue-500/50 hover:bg-slate-900/90 transition-all duration-200"
                    >
                      <div className="space-y-3">
                        {/* Header Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {tender.referenceNumber}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                            <Tag className="h-3 w-3" />
                            {tender.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition line-clamp-2">
                          {tender.title}
                        </h2>

                        {/* Organization */}
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Building2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{tender.organization}</span>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-slate-800/80">
                          <div>
                            <span className="text-slate-500 block">Est. Value</span>
                            <span className="font-semibold text-slate-200">{formatCurrency(tender.estimatedValue)}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Location</span>
                            <span className="font-medium text-slate-300 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-500" />
                              {tender.state || "India"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions & Deadline */}
                      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        {/* Deadline Badge */}
                        <div
                          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg ${
                            isUrgent
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : daysLeft <= 0
                              ? "bg-red-500/10 text-red-400 border border-red-500/30"
                              : "bg-slate-950 text-slate-400 border border-slate-800"
                          }`}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? "Due Today" : "Closed"}
                          </span>
                        </div>

                        {/* Action Link */}
                        <Link
                          href={`/tenders/${tender.id}`}
                          className="inline-flex items-center gap-1 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white px-3.5 py-1.5 text-xs font-semibold transition"
                        >
                          <span>View Tender</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-400 px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
