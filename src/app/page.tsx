import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Sparkles, Search, ShieldCheck, Zap, ArrowRight, Building2, FileCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/15 blur-3xl pointer-events-none rounded-full" />

        <div className="mx-auto max-w-4xl text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
            <Sparkles className="h-4 w-4" />
            AI-Powered Government Procurement Intelligence
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Discover & Evaluate Tenders with <span className="text-blue-500">AI Precision</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            TenderIQ turns complex Indian government procurement documents into instant eligibility insights, automated search filters, and tracking workflows.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/tenders"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-indigo-500/25 hover:brightness-110 active:scale-95 transition"
            >
              <Search className="h-5 w-5" />
              <span>Explore Tender Discovery</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 px-8 py-4 text-base font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition"
            >
              <Building2 className="h-5 w-5 text-blue-400" />
              <span>Company Onboarding</span>
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-16 border-t border-slate-800/80">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">AI Search Intent Parser</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Query tenders in plain English or regional terminology. Gemini AI maps queries to exact state, value, and type criteria.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Document Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically extract technical requirements, turn-over eligibility thresholds, and mandatory document checklists.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Multi-Tenant Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Secure company data isolation with built-in IDOR protection for company profiles, applications, and analyses.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
