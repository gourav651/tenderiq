"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  FileText,
  IndianRupee,
  MapPin,
  Sparkles,
  ShieldCheck,
  Tag,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  ExternalLink,
  Layers,
} from "lucide-react";

interface TenderDocument {
  id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  documentType?: string;
  fileSize?: number;
}

interface TenderRequirement {
  id: string;
  type: string;
  title: string;
  description: string;
  isMandatory: boolean;
  sourcePage?: number;
}

interface AIAnalysis {
  id: string;
  type: string;
  result: any;
  model: string;
  createdAt: string;
}

interface TenderDetails {
  id: string;
  referenceNumber: string;
  title: string;
  description?: string;
  organization: string;
  category: string;
  country: string;
  state?: string;
  city?: string;
  location?: string;
  estimatedValue?: number;
  currency: string;
  tenderType: string;
  publishedAt?: string;
  submissionDeadline: string;
  status: string;
  sourceName?: string;
  sourceUrl?: string;
  documents: TenderDocument[];
  requirements: TenderRequirement[];
  aiAnalyses: AIAnalysis[];
}

export default function TenderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tenderId = resolvedParams.id;

  const [tender, setTender] = useState<TenderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "requirements" | "documents" | "ai">("overview");

  useEffect(() => {
    async function fetchTender() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tenders/${tenderId}`);
        const json = await res.json();
        if (json.success) {
          setTender(json.data);
        } else {
          setError(json.error?.message || "Tender not found.");
        }
      } catch (err) {
        console.error("Failed to fetch tender details", err);
        setError("Error connecting to server.");
      } finally {
        setLoading(false);
      }
    }
    fetchTender();
  }, [tenderId]);

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Not Disclosed";
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Crore`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-32 bg-slate-900 rounded" />
            <div className="h-10 w-3/4 bg-slate-900 rounded-xl" />
            <div className="h-40 w-full bg-slate-900 rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !tender) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-20 text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-200">Tender Not Found</h2>
          <p className="text-slate-400">{error || "The requested tender could not be located."}</p>
          <Link
            href="/tenders"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tender Discovery
          </Link>
        </main>
      </div>
    );
  }

  // Pre-generated AI Summary analysis if present
  const aiSummary = tender.aiAnalyses.find((a) => a.type === "SUMMARY")?.result;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/tenders"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-400 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Tender Discovery
          </Link>
        </div>

        {/* Hero Header Card */}
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 relative z-10">
            <div className="space-y-4 max-w-4xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-medium text-slate-300 bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg">
                  Ref: {tender.referenceNumber}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-medium text-blue-400">
                  <Tag className="h-3 w-3" />
                  {tender.category}
                </span>
                <span className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 font-medium text-slate-300">
                  Type: {tender.tenderType}
                </span>
                <span
                  className={`rounded-lg px-3 py-1 font-semibold uppercase tracking-wider ${
                    tender.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tender.status}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
                {tender.title}
              </h1>

              {/* Organization & Location */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-slate-500" />
                  <span>{tender.organization}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span>
                    {tender.city ? `${tender.city}, ` : ""}
                    {tender.state || tender.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Application Action Button */}
            <div className="flex flex-col gap-3 shrink-0 sm:w-64">
              <button
                type="button"
                onClick={() => alert(`Starting application process for Tender: ${tender.referenceNumber}`)}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl hover:brightness-110 active:scale-95 transition text-center"
              >
                Track & Apply Now
              </button>
              {tender.sourceUrl && (
                <a
                  href={tender.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  <span>Official Portal Link</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Key Quick Stats Bar */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800/80 pt-6">
            <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3.5">
              <span className="text-xs text-slate-500 block mb-1">Estimated Budget</span>
              <span className="text-base sm:text-lg font-extrabold text-blue-400 flex items-center gap-0.5">
                {formatCurrency(tender.estimatedValue)}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3.5">
              <span className="text-xs text-slate-500 block mb-1">Submission Deadline</span>
              <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400" />
                {formatDate(tender.submissionDeadline)}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3.5">
              <span className="text-xs text-slate-500 block mb-1">Published On</span>
              <span className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-500" />
                {formatDate(tender.publishedAt)}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-3.5">
              <span className="text-xs text-slate-500 block mb-1">Requirements</span>
              <span className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                {tender.requirements.length} Items Listed
              </span>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800">
          <nav className="flex gap-4 text-sm font-semibold">
            {[
              { id: "overview", label: "Tender Overview", icon: FileText },
              { id: "requirements", label: `Requirements (${tender.requirements.length})`, icon: Layers },
              { id: "documents", label: `Documents (${tender.documents.length})`, icon: Download },
              { id: "ai", label: "✨ AI Intelligence Summary", icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-2 border-b-2 transition ${
                    isActive
                      ? "border-blue-500 text-blue-400 font-bold"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tab Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <h3 className="text-lg font-bold text-slate-100">Detailed Scope of Work</h3>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {tender.description || "No specific detailed description provided for this tender."}
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h4 className="text-sm font-semibold text-slate-200 mb-3">Tender Metadata Summary</h4>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <dt className="text-slate-500">Source Platform</dt>
                      <dd className="font-medium text-slate-200 mt-0.5">{tender.sourceName || "Central Public Procurement Portal"}</dd>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <dt className="text-slate-500">Currency</dt>
                      <dd className="font-medium text-slate-200 mt-0.5">{tender.currency}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Requirements Tab */}
            {activeTab === "requirements" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-100">Eligibility & Technical Requirements</h3>
                {tender.requirements.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400 text-sm">
                    No specific requirements cataloged yet.
                  </div>
                ) : (
                  tender.requirements.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                          {req.type}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                            req.isMandatory
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {req.isMandatory ? "Mandatory Criteria" : "Optional"}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-100">{req.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{req.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-100">Official Tender Documents</h3>
                {tender.documents.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400 text-sm">
                    No downloadable documents attached to this tender.
                  </div>
                ) : (
                  tender.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
                          <FileSpreadsheet className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200">{doc.name}</h4>
                          <p className="text-xs text-slate-500">{doc.fileName}</p>
                        </div>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* AI Summary Tab */}
            {activeTab === "ai" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950 p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-4">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-indigo-200">AI Intelligence Executive Summary</h3>
                  </div>

                  {aiSummary ? (
                    <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                      {aiSummary.summary && (
                        <div>
                          <h4 className="font-semibold text-indigo-300 mb-1">Executive Summary</h4>
                          <p className="leading-relaxed text-slate-300">{aiSummary.summary}</p>
                        </div>
                      )}

                      {aiSummary.keyHighlights && (
                        <div>
                          <h4 className="font-semibold text-indigo-300 mb-1">Key Highlights</h4>
                          <ul className="list-disc pl-5 space-y-1 text-slate-300">
                            {aiSummary.keyHighlights.map((hl: string, idx: number) => (
                              <li key={idx}>{hl}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {aiSummary.eligibilityCriteria && (
                        <div>
                          <h4 className="font-semibold text-indigo-300 mb-1">Financial & Technical Eligibility</h4>
                          <ul className="list-disc pl-5 space-y-1 text-slate-300">
                            {aiSummary.eligibilityCriteria.map((ec: string, idx: number) => (
                              <li key={idx}>{ec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 py-4 text-center">
                      AI summary is currently generating for this tender. Check back shortly.
                    </div>
                  )}
                </div>

                {/* AI Disclaimer Box */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-300">Procurement Advice Disclaimer: </strong>
                    AI-generated summaries are intended purely for quick discovery and eligibility evaluation. Always refer to original official procurement documents for binding legal terms.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Widget */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5 sticky top-24">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Opportunity Checklist</h3>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Verify minimum turnover match</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Review experience certificate requirements</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Confirm EMD & tender fee details</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => alert(`Starting application process for Tender: ${tender.referenceNumber}`)}
                  className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition text-center shadow-lg"
                >
                  Create Application Draft
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
