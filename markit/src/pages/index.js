import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '../components/seo';
import Footer from '../components/layout/Footer';
import { projectsAPI } from '../utils/api';
import { formatCurrency } from '../utils/formatters';
import { IconShield, IconHardHat, IconUser, IconSearch, IconTarget, IconMapPin, IconBarChart, IconMegaphone, IconCreditCard } from '../components/common/Icons';

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    projectsAPI.getAll({ limit: 50 })
      .then((res) => { if (res.success) setProjects(res.data.projects); })
      .catch(() => { });
  }, []);

  const totalBudget = projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);
  const totalProjects = projects.length;
  const flagged = projects.filter((p) => p.riskFlag).length;

  const roles = [
    {
      title: 'Admin Portal',
      icon: <IconShield size={36} color="#3B82F6" />,
      desc: 'Monitor all projects, analyze spending, detect red flags, and manage citizen complaints.',
      color: '#3B82F6',
      lightBg: '#EFF6FF',
      href: '/auth/admin-login',
      features: ['Budget Analytics', 'Risk Detection', 'Complaint Management'],
    },
    {
      title: 'Contractor Portal',
      icon: <IconHardHat size={36} color="#F59E0B" />,
      desc: 'Update project progress, upload GPS-tagged photos, and track payment tranches.',
      color: '#F59E0B',
      lightBg: '#FEF3C7',
      href: '/auth/contractor-login',
      features: ['Progress Updates', 'Photo Upload', 'Payment Tracking'],
    },
    {
      title: 'Citizen Portal',
      icon: <IconUser size={36} color="#10B981" />,
      desc: 'Browse government projects, monitor progress on map, and submit concerns.',
      color: '#10B981',
      lightBg: '#D1FAE5',
      href: '/auth/citizen-login',
      features: ['Project Gallery', 'Map View', 'File Complaints'],
    },
  ];

  return (
    <>
      <SEO pageTitle="PETMS - Public Expenditure Transparency & Monitoring System" />

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm" style={{ borderBottom: '3px solid #3B82F6' }}>
        <div className="container">
          <Link href="/">
            <a className="navbar-brand fw-bold d-flex align-items-center gap-2" style={{ color: '#1E40AF', fontSize: 22 }}>
              <IconShield size={24} color="#3B82F6" /> PETMS
            </a>
          </Link>
          <span className="text-muted" style={{ fontSize: 13 }}>Public Expenditure Transparency & Monitoring</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 50%, #C7D2FE 100%)', minHeight: 380 }}>
        <div className="container text-center py-5">
          <div className="mb-3">
            <span className="badge bg-white text-dark px-3 py-2 shadow-sm" style={{ fontSize: 12, borderRadius: 20 }}>Making Governance Transparent</span>
          </div>
          <h1 className="fw-bold mb-3" style={{ color: '#1E3A5F', fontSize: 42, lineHeight: 1.2, maxWidth: 700, margin: '0 auto' }}>
            Track Every Rupee of Public Spending
          </h1>
          <p className="mb-4 mx-auto" style={{ color: '#4B5563', fontSize: 17, maxWidth: 600 }}>
            Real-time monitoring of government projects with AI-powered red flag detection, GPS verification, and citizen social auditing.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <div className="px-4 py-2 rounded shadow-sm bg-white">
              <div className="fw-bold" style={{ color: '#3B82F6', fontSize: 22 }}>{totalProjects || '—'}</div>
              <small className="text-muted">Projects</small>
            </div>
            <div className="px-4 py-2 rounded shadow-sm bg-white">
              <div className="fw-bold" style={{ color: '#10B981', fontSize: 22 }}>{totalBudget > 0 ? formatCurrency(totalBudget) : '—'}</div>
              <small className="text-muted">Budget</small>
            </div>
            <div className="px-4 py-2 rounded shadow-sm bg-white">
              <div className="fw-bold" style={{ color: '#EF4444', fontSize: 22 }}>{totalProjects > 0 ? flagged : '—'}</div>
              <small className="text-muted">Flagged</small>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-5" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Choose Your Portal</h2>
            <p className="text-muted">Login based on your role to access the appropriate dashboard</p>
          </div>
          <div className="row g-4 justify-content-center">
            {roles.map((role) => (
              <div key={role.title} className="col-md-4">
                <Link href={role.href}>
                  <a className="text-decoration-none">
                    <div className="card border-0 shadow-sm h-100 text-center" style={{
                      borderRadius: 16, borderTop: `4px solid ${role.color}`, overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer'
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'; }}>
                      <div className="card-body p-5">
                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                          style={{ width: 80, height: 80, backgroundColor: role.lightBg }}>
                          {role.icon}
                        </div>
                        <h4 className="fw-bold mb-3" style={{ color: role.color }}>{role.title}</h4>
                        <p className="text-muted mb-4" style={{ fontSize: 14 }}>{role.desc}</p>
                        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                          {role.features.map((f) => (
                            <span key={f} className="badge rounded-pill" style={{ backgroundColor: role.lightBg, color: role.color, fontSize: 11, fontWeight: 500, padding: '5px 12px' }}>
                              {f}
                            </span>
                          ))}
                        </div>
                        <div className="btn text-white w-100 py-2 fw-semibold" style={{ backgroundColor: role.color, borderRadius: 10, fontSize: 14 }}>
                          Login →
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5" style={{ backgroundColor: '#fff' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h3 className="fw-bold">Key Features</h3>
          </div>
          <div className="row g-4">
            {[
              { icon: <IconSearch size={28} color="#3B82F6" />, title: 'Red Flag Detection', desc: 'AI-powered engine detects budget overruns, timeline delays, and suspicious spending patterns.' },
              { icon: <IconMapPin size={28} color="#10B981" />, title: 'GPS Verification', desc: 'Geotagged photos verify contractors are actually present at project sites.' },
              { icon: <IconBarChart size={28} color="#8B5CF6" />, title: 'Analytics Dashboard', desc: 'Real-time analytics with charts showing budget allocation, spending trends, and risk metrics.' },
              { icon: <IconTarget size={28} color="#F59E0B" />, title: 'Map Visualization', desc: 'Interactive map showing all projects with status-coded markers and filters.' },
              { icon: <IconMegaphone size={28} color="#EF4444" />, title: 'Social Auditing', desc: 'Citizens can upvote complaints and raise concerns about project quality.' },
              { icon: <IconCreditCard size={28} color="#06B6D4" />, title: 'Payment Tracking', desc: 'Track payment tranches and disbursements for every project.' },
            ].map((feature) => (
              <div key={feature.title} className="col-md-4 col-6">
                <div className="text-center p-4 rounded" style={{ backgroundColor: '#F9FAFB', borderRadius: 12 }}>
                  <div className="d-flex justify-content-center mb-3">{feature.icon}</div>
                  <h6 className="fw-bold mb-2">{feature.title}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: 13 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
