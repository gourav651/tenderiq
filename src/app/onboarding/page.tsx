"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "Renewable Energy & EPC",
    website: "",
    location: "Bhubaneswar, Odisha",
    state: "Odisha",
    city: "Bhubaneswar",
    annualTurnover: "250000000",
    yearsOfExperience: "12",
    certifications: "ISO 9001:2015, ISO 14001:2015, MNRE Registered",
    areasOfOperation: "Solar Parks, Rooftop Solar, Microgrids, Battery Storage",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        industry: formData.industry,
        website: formData.website || undefined,
        location: formData.location || undefined,
        state: formData.state || undefined,
        city: formData.city || undefined,
        annualTurnover: formData.annualTurnover ? parseFloat(formData.annualTurnover) : undefined,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience, 10) : undefined,
        certifications: formData.certifications
          ? formData.certifications.split(",").map((c) => c.trim()).filter(Boolean)
          : [],
        areasOfOperation: formData.areasOfOperation
          ? formData.areasOfOperation.split(",").map((a) => a.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch("/api/company/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.error?.message || "Failed to submit company onboarding profile.");
      } else {
        setSuccessMsg("Company onboarded successfully! Redirecting to workspace...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Phase 2 — Company Onboarding
          </div>
          
          <h1 className="text-3xl font-bold text-slate-100">Setup Your Company Profile</h1>
          <p className="mt-2 text-slate-400">
            TenderIQ uses your company profile to match eligible government tenders, calculate AI suitability scores, and keep company data isolated.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                  Company Name <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Apex Solar EPC Solutions Pvt Ltd"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                  Primary Industry <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  required
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="e.g. Renewable Energy, Civil Infrastructure"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://company.example.com"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                  Headquarters Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bhubaneswar, Odisha"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                  Primary Operating State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Odisha"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Annual Turnover */}
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                  Annual Turnover (INR)
                </label>
                <input
                  type="number"
                  name="annualTurnover"
                  value={formData.annualTurnover}
                  onChange={handleChange}
                  placeholder="e.g. 250000000"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="e.g. 12"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                  Company Overview & Capabilities
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe key projects, client list, or capabilities..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Certifications */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                  Certifications (Comma Separated)
                </label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  placeholder="e.g. ISO 9001:2015, ISO 14001:2015, Class A Contractor"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Areas of Operation */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                  Areas / Domains of Operation (Comma Separated)
                </label>
                <input
                  type="text"
                  name="areasOfOperation"
                  value={formData.areasOfOperation}
                  onChange={handleChange}
                  placeholder="e.g. Solar Parks, Rooftop Solar, High-Voltage Transmission"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Saving Profile..." : "Complete Onboarding & Enter Workspace →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
