"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Briefcase, Search, UserCheck, LogOut, Sparkles, BarChart3 } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  const navLinks = [
    { href: "/tenders", label: "Tender Discovery", icon: Search },
    { href: "/applications", label: "My Applications", icon: Briefcase },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/onboarding", label: "Company Profile", icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/tenders" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white transition hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Tender<span className="text-blue-500">IQ</span>
          </span>
        </Link>

        {/* Primary Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-800/80 text-blue-400 border border-slate-700/60"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Auth Action */}
        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-800" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-slate-200">{session.user.name || "User"}</span>
                <span className="text-xs text-slate-400">{session.user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-md hover:from-blue-500 hover:to-indigo-500 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
