"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import {
  Briefcase,
  Clock,
  Building2,
  ExternalLink,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Search,
  FileSpreadsheet,
  PlusCircle,
} from "lucide-react";

interface Tender {
  id: string;
  referenceNumber: string;
  title: string;
  organization: string;
  category: string;
  estimatedValue?: number;
  submissionDeadline: string;
}

interface Application {
  id: string;
  status: "SAVED" | "INTERESTED" | "PREPARING" | "SUBMITTED" | "UNDER_EVALUATION" | "WON" | "LOST";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tender: Tender;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/applications");
      const json = await res.json();
      if (json.success) {
        setApplications(json.data);
      } else {
        setError(json.error?.message || "Failed to load applications.");
      }
    } catch (err) {
      console.error("Failed to load applications", err);
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: newStatus as any } : app))
        );
      } else {
        alert(json.error?.message || "Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    if (!confirm("Are you sure you want to remove this application from tracking?")) return;

    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setApplications((prev) => prev.filter((app) => app.id !== appId));
      } else {
        alert(json.error?.message || "Failed to delete application.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete application.");
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const filteredApplications =
    selectedStatus === "ALL"
      ? applications
      : applications.filter((app) => app.status === selectedStatus);

  const statuses = [
    { key: "ALL", label: "All Applications" },
    { key: "SAVED", label: "Saved" },
    { key: "INTERESTED", label: "Interested" },
    { key: "PREPARING", label: "Preparing" },
    { key: "SUBMITTED", label: "Submitted" },
    { key: "WON", label: "Won" },
    { key: "LOST", label: "Lost" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Header Banner */}
      <section className="border-b border-slate-800 bg-slate-900/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-2">
              <Briefcase className="h-3.5 w-3.5" />
              Company Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Application Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your tracked government tender bids, update progress stages, and meet submission deadlines.
            </p>
          </div>

          <Link
            href="/tenders"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg hover:brightness-110 transition shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Discover More Tenders</span>
          </Link>
        </div>
      </section>

      {/* Main Tracker View */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {statuses.map((st) => (
            <button
              key={st.key}
              onClick={() => setSelectedStatus(st.key)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                selectedStatus === st.key
                  ? "bg-blue-600 text-white shadow"
                  : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          /* Empty Applications State */
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
            <FileSpreadsheet className="h-12 w-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No applications found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You haven&apos;t added any tender applications under this category yet. Head to Tender Discovery to start tracking tenders.
            </p>
            <Link
              href="/tenders"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <Search className="h-3.5 w-3.5" />
              Browse Tenders
            </Link>
          </div>
        ) : (
          /* Applications List */
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col md:flex-row md:items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg gap-4 hover:border-slate-700 transition"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {app.tender.referenceNumber}
                    </span>
                    <span className="text-xs text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20 font-medium">
                      {app.tender.category}
                    </span>
                  </div>

                  <Link href={`/tenders/${app.tender.id}`} className="text-base font-bold text-slate-100 hover:text-blue-400 transition block">
                    {app.tender.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      <span>{app.tender.organization}</span>
                    </div>
                    <div>
                      Est. Value: <strong className="text-slate-200">{formatCurrency(app.tender.estimatedValue)}</strong>
                    </div>
                  </div>
                </div>

                {/* Status & Actions Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0">
                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="SAVED">Saved</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="WON">Won</option>
                    <option value="LOST">Lost</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tenders/${app.tender.id}`}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:text-white transition"
                      title="View Tender Details"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteApplication(app.id)}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:text-red-400 transition"
                      title="Remove Tracking"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
