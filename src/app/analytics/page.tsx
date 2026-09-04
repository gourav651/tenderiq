"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Award,
  Layers,
  ExternalLink,
  AlertCircle,
  Briefcase,
} from "lucide-react";

interface AnalyticsData {
  totalApplications: number;
  totalPipelineValue: number;
  winRatePercentage: number;
  statusBreakdown: Record<string, number>;
  categoryBreakdown: Array<{ category: string; count: number; totalValue: number }>;
  topTenderOpportunities: Array<{
    id: string;
    referenceNumber: string;
    title: string;
    estimatedValue?: number | null;
    category: string;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error?.message || "Failed to load analytics.");
        }
      } catch (err) {
        console.error("Error fetching analytics", err);
        setError("Error connecting to analytics server.");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const formatCurrency = (amount?: number | null) => {
    if (!amount) return "₹0";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Header Banner */}
      <section className="border-b border-slate-800 bg-slate-900/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-2">
            <BarChart3 className="h-3.5 w-3.5" />
            Procurement Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Procurement Analytics & Pipeline Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track company application funnel stats, category breakdowns, and total pipeline budget value.
          </p>
        </div>
      </section>

      {/* Main Analytics Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800" />
            ))}
          </div>
        ) : data ? (
          <>
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-2 shadow-xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Tracked Applications
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white">{data.totalApplications}</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-2 shadow-xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Pipeline Budget
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-blue-400">
                    {formatCurrency(data.totalPipelineValue)}
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-2 shadow-xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Win Conversion Rate
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-indigo-400">
                    {data.winRatePercentage}%
                  </span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Award className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Application Pipeline Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Funnel Progress */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-400" />
                    Application Pipeline Funnel
                  </h3>
                </div>

                <div className="space-y-4">
                  {Object.entries(data.statusBreakdown).map(([statusKey, count]) => {
                    const pct = data.totalApplications > 0 ? Math.round((count / data.totalApplications) * 100) : 0;
                    return (
                      <div key={statusKey} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300 capitalize">{statusKey.replace("_", " ")}</span>
                          <span className="text-slate-400">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Distribution */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-indigo-400" />
                    Category & Sector Distribution
                  </h3>
                </div>

                {data.categoryBreakdown.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No active category statistics recorded yet. Start tracking tenders to populate analytics.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.categoryBreakdown.map((cat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="font-semibold text-slate-200">{cat.category}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                          <span>{cat.count} Bids</span>
                          <strong className="text-slate-200">{formatCurrency(cat.totalValue)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Tender Opportunities Table */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-100">Top High-Value Active Tenders</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase tracking-wider font-medium">
                    <tr>
                      <th className="py-3 px-4">Ref Number</th>
                      <th className="py-3 px-4">Tender Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Est. Value</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data.topTenderOpportunities.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-900/80 transition">
                        <td className="py-3 px-4 font-mono text-slate-400">{t.referenceNumber}</td>
                        <td className="py-3 px-4 font-bold text-slate-200">{t.title}</td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-semibold">
                            {t.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-blue-400">{formatCurrency(t.estimatedValue)}</td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/tenders/${t.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                          >
                            <span>View</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
