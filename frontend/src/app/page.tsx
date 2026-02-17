'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { projectsAPI, statsAPI } from '@/utils/api';
import StatusBadge from '@/components/common/StatusBadge';
import RiskBadge from '@/components/common/RiskBadge';
import { MoneyDisplay } from '@/components/common/MoneyDisplay';
import { ShieldCheckIcon, MapPinIcon, ChatBubbleLeftRightIcon, ArrowTrendingUpIcon, ChartBarIcon, EyeIcon, BellAlertIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.max(1, Math.floor(value / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span className="font-mono">{prefix}{display.toLocaleString('en-IN')}{suffix}</span>;
}

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);
  const [flaggedProjects, setFlaggedProjects] = useState<any[]>([]);

  useEffect(() => {
    projectsAPI.getAll({ riskFlag: true, limit: 3 })
      .then((d: any) => setFlaggedProjects(d.data?.projects || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-200/60 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-xl font-heading font-bold text-surface-900">PETMS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-surface-600 hover:text-brand-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-brand-50">
              Login
            </Link>
            <Link href="/auth/register" className="text-sm bg-brand-600 hover:bg-brand-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all hover:shadow-glow-brand">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-success-400/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-28 lg:py-40 text-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 bg-brand-50 border border-brand-200/60 px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
              Transparency Platform
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-black leading-tight mb-6 animate-slide-up text-surface-900">
            Government Spending.{' '}
            <span className="gradient-text">Transparent.</span>
            <br />Accountable. <span className="text-accent-500">Now.</span>
          </h1>
          <p className="text-lg lg:text-xl text-surface-500 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Track public expenditure, monitor government projects in real-time, and hold officials accountable.
            PETMS makes corruption visible at a glance.
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/auth/login" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-glow-brand hover:-translate-y-0.5 active:translate-y-0">
              Enter Portal
            </Link>
            <Link href="/auth/register" className="border-2 border-surface-200 hover:border-brand-300 text-surface-700 hover:text-brand-600 font-medium px-8 py-3.5 rounded-xl transition-all hover:bg-brand-50">
              Register as Citizen
            </Link>
          </div>
        </div>
      </section>

      {/* Role Portal Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-heading font-bold text-surface-900 mb-3">Choose Your Portal</h2>
          <p className="text-surface-500">Select your role to access the right tools</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { role: 'Admin', desc: 'Monitor all projects, manage complaints, view analytics', gradient: 'from-brand-500 to-brand-700', bg: 'bg-brand-50', ring: 'ring-brand-100', icon: ShieldCheckIcon, href: '/auth/login' },
            { role: 'Contractor', desc: 'Submit progress updates, upload evidence, track payments', gradient: 'from-accent-500 to-accent-600', bg: 'bg-accent-50', ring: 'ring-accent-100', icon: ArrowTrendingUpIcon, href: '/auth/login' },
            { role: 'Citizen', desc: 'Browse projects, file complaints, vote on issues', gradient: 'from-success-500 to-success-600', bg: 'bg-success-50', ring: 'ring-success-100', icon: ChatBubbleLeftRightIcon, href: '/auth/login' },
          ].map((p, i) => (
            <Link
              key={p.role}
              href={p.href}
              className={`group bg-white border border-surface-200/60 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated animate-slide-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <p.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-heading font-bold text-surface-900 mb-2">{p.role} Portal</h3>
              <p className="text-surface-500 text-sm leading-relaxed">{p.desc}</p>
              <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-brand-600 group-hover:gap-3 transition-all">
                Enter <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-surface-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-surface-900 mb-3">Key Features</h2>
            <p className="text-surface-500">Powerful tools for transparency and accountability</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Risk Detection', desc: 'Automated red-flag engine scores every project', icon: BellAlertIcon, color: 'text-danger-500', bg: 'bg-danger-50' },
              { title: 'Map View', desc: 'See all projects on an interactive map', icon: GlobeAltIcon, color: 'text-brand-500', bg: 'bg-brand-50' },
              { title: 'Complaint Tracking', desc: 'File and track complaints with unique IDs', icon: ChatBubbleLeftRightIcon, color: 'text-accent-500', bg: 'bg-accent-50' },
              { title: 'GPS Verification', desc: 'Verify contractor location with GPS validation', icon: MapPinIcon, color: 'text-success-500', bg: 'bg-success-50' },
            ].map((f, i) => (
              <div key={f.title} className="group bg-surface-50 hover:bg-white border border-surface-200/60 hover:border-surface-300/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-1 animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-heading font-semibold text-surface-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Flagged Projects */}
      {flaggedProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-surface-900 mb-3">
              <span className="risk-pulse text-danger-500">&#9888;</span> Recently Flagged Projects
            </h2>
            <p className="text-surface-500">Projects that need attention</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flaggedProjects.map((p: any, i: number) => (
              <div key={p._id} className="bg-white border border-surface-200/60 rounded-2xl p-6 border-l-4 border-l-danger-400 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-heading font-semibold text-surface-900 text-sm">{p.title}</h3>
                  <RiskBadge isRiskFlagged={p.riskFlag} riskFactors={p.riskFactors} />
                </div>
                <p className="text-xs text-surface-400 mb-3">{p.department} &middot; {p.location?.city}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-500">Budget: <MoneyDisplay amount={p.totalBudget} /></span>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-12 lg:p-16 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-400/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-4">Ready to make a difference?</h2>
            <p className="text-brand-200 text-lg mb-8 max-w-xl mx-auto">Join thousands of citizens tracking government spending in their communities.</p>
            <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-all hover:shadow-lg hover:-translate-y-0.5">
              Get Started Free &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-lg font-heading font-bold text-surface-900">PETMS</span>
          </div>
          <p className="text-sm text-surface-500">Public Expenditure Transparency & Monitoring System</p>
          <p className="text-xs text-surface-400 mt-1">Built under the Right to Information Act, 2005</p>
        </div>
      </footer>
    </div>
  );
}
