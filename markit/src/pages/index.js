import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '../components/seo';
import Footer from '../components/layout/Footer';
import { projectsAPI } from '../utils/api';
import { formatCurrency } from '../utils/formatters';
import { IconShield, IconHardHat, IconUser, IconSearch, IconTarget, IconMapPin, IconBarChart, IconMegaphone, IconCreditCard, IconArrowRight, IconTrendingUp } from '../components/common/Icons';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    projectsAPI.getAll({ limit: 50 })
      .then((res) => { if (res.success) setProjects(res.data.projects); })
      .catch(() => { });

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalBudget = projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);
  const totalProjects = projects.length;
  // Stats for the hero section
  const activeContractors = new Set(projects.map(p => p.contractor)).size || 12; // Demo fallback
  const completionRate = 87; // Demo static value for impact

  const roles = [
    {
      title: 'Admin Portal',
      icon: <IconShield size={32} color="#ffffff" />,
      desc: 'Oversee all project lifecycles, monitor spending, and ensure compliance.',
      color: '#2563EB', // Royal Blue
      bgImage: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
      href: '/auth/admin-login',
      badge: 'Restricted'
    },
    {
      title: 'Contractor Portal',
      icon: <IconHardHat size={32} color="#ffffff" />,
      desc: 'Manage milestones, upload GPS evidence, and track your payments.',
      color: '#DC2626', // Red
      bgImage: 'linear-gradient(135deg, #991B1B 0%, #EF4444 100%)',
      href: '/auth/contractor-login',
      badge: 'Partner'
    },
    {
      title: 'Citizen Portal',
      icon: <IconUser size={32} color="#ffffff" />,
      desc: 'Be the eyes of the community. Track projects and report issues.',
      color: '#059669', // Emerald
      bgImage: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)',
      href: '/auth/citizen-login',
      badge: 'Public'
    },
  ];

  return (
    <>
      <SEO pageTitle="PETMS - Empowering Transparent Governance" />

      {/* Navbar */}
      <nav className={`navbar navbar-expand-lg fixed-top transition-all ${scrolled ? 'bg-white shadow-sm py-2' : 'bg-transparent py-4'}`}
        style={{ transition: 'all 0.3s ease' }}>
        <div className="container">
          <Link href="/">
            <a className="navbar-brand fw-bold d-flex align-items-center gap-2" style={{ color: '#1E3A8A', fontSize: 24, letterSpacing: '-0.5px' }}>
              <div className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 40, height: 40, background: scrolled ? 'linear-gradient(135deg, #1E3A8A, #3B82F6)' : '#1E3A8A', border: 'none' }}>
                <IconShield size={20} color="#ffffff" />
              </div>
              PETMS
            </a>
          </Link>
          <div className="d-none d-md-block text-secondary fw-semibold small text-uppercase" style={{ letterSpacing: '1px' }}>
            Public Expenditure Transparency & Monitoring System
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="position-relative d-flex align-items-center justify-content-center overflow-hidden" style={{ minHeight: '90vh', paddingTop: 80 }}>
        {/* Background */}
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <div className="position-absolute w-100 h-100" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1518391846015-55a3385287d6?q=80&w=2574")', // White/Grey abstract geometric
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(100%) brightness(1.1) contrast(0.95)'
          }}></div>
          <div className="position-absolute w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 100%)' }}></div>
          {/* Animated mesh or gradient blobs could go here for extra premium feel */}
        </div>

        <div className="container position-relative z-index-1 text-center mt-5">
          <div className="mx-auto mb-4" style={{ maxWidth: 800 }}>
            <span className="d-inline-block py-1 px-3 rounded-pill bg-white border border-secondary border-opacity-20 mb-4 shadow-sm" style={{ fontSize: 13, letterSpacing: '1px', color: '#B45309' }}>
              <span className="text-warning me-2">★</span> OFFICIAL GOVERNMENT EXPENDITURE TRACKER
            </span>
            <h1 className="display-3 fw-bold mb-4" style={{ lineHeight: 1.1, letterSpacing: '-1px', color: '#0F172A' }}>
              Ensuring Every Rupee <br />
              <span className="text-primary">
                Counts for India
              </span>
            </h1>
            <p className="lead mb-5 mx-auto text-secondary fw-normal" style={{ maxWidth: 650, fontSize: 20 }}>
              The Public Expenditure Transparency & Monitoring System (PETMS) provides citizens with real-time insight into infrastructure projects, budget allocations, and spending efficiency.
            </p>


          </div>

          {/* Floating Stats Cards */}
          <div className="row g-4 justify-content-center mt-5">
            {[
              { label: 'Total Projects', value: totalProjects || '1,240+', icon: <IconBarChart size={32} color="#2563EB" />, color: '#2563EB' },
              { label: 'Public Budget', value: totalBudget ? formatCurrency(totalBudget) : '₹842 Cr+', icon: <IconMapPin size={32} color="#059669" />, color: '#059669' },
              { label: 'Completion Rate', value: `${completionRate}%`, icon: <IconTrendingUp size={32} color="#D97706" />, color: '#D97706' }
            ].map((stat, i) => (
              <div key={i} className="col-md-3">
                <div className="p-4 rounded-4 bg-white shadow-sm border border-light h-100 position-relative overflow-hidden hover-lift-lg"
                  style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="p-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: `${stat.color}15`, width: 60, height: 60 }}>
                      {stat.icon}
                    </div>
                    <div className="text-start">
                      <h2 className="fw-bold mb-0 text-dark" style={{ fontSize: '2rem' }}>{stat.value}</h2>
                      <div className="text-muted text-uppercase fw-bold small" style={{ fontSize: 11, letterSpacing: '1px' }}>{stat.label}</div>
                    </div>
                  </div>
                  <div className="progress" style={{ height: 4 }}>
                    <div className="progress-bar" role="progressbar" style={{ width: '70%', backgroundColor: stat.color }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Section - Overlapping */}
      <section className="py-5 bg-light position-relative" style={{ marginTop: -1 }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <small className="text-primary fw-bold text-uppercase tracking-wider">Access Portals</small>
            <h2 className="display-6 fw-bold text-dark mt-2">Who are you?</h2>
          </div>

          <div className="row g-4">
            {roles.map((role, idx) => (
              <div key={idx} className="col-lg-4">
                <Link href={role.href}>
                  <a className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm overflow-hidden hover-card" style={{ borderRadius: 20 }}>
                      <div className="p-4 position-relative d-flex flex-column align-items-center justify-content-center text-center text-white"
                        style={{ background: role.bgImage, minHeight: 160 }}>

                        {/* Badge */}
                        <div className="position-absolute top-0 end-0 p-3">
                          <span className="badge bg-white text-dark rounded-pill px-3 py-1 fw-bold shadow-sm" style={{ fontSize: 10 }}>{role.badge}</span>
                        </div>

                        {/* Icon Circle */}
                        <div className="mb-3 p-3 rounded-circle bg-white shadow-lg d-flex align-items-center justify-content-center"
                          style={{ width: 70, height: 70 }}>
                          {/* Rendering default icons with specific colors based on role */}
                          {idx === 0 && <IconShield size={32} color="#2563EB" />}
                          {idx === 1 && <IconHardHat size={32} color="#DC2626" />}
                          {idx === 2 && <IconUser size={32} color="#059669" />}
                        </div>

                        <h3 className="fw-bold mb-0">{role.title}</h3>
                      </div>
                      <div className="card-body p-4 bg-white text-center">
                        <p className="text-secondary mb-4 small" style={{ minHeight: 40 }}>{role.desc}</p>
                        <div className="btn btn-outline-primary rounded-pill px-4 fw-bold btn-sm">
                          Access Dashboard <IconArrowRight size={16} className="ms-1" />
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

      {/* Features Grid */}
      <section id="features" className="py-5 bg-white">
        <div className="container py-5">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-3">Transparency driven by <span className="text-primary">Technology</span></h2>
              <p className="lead text-muted">Leveraging AI, GPS, and Blockchain to ensure zero leakage in public funds.</p>
            </div>
          </div>

          <div className="row g-4">
            {[
              { title: "AI Red-Flagging", desc: "Automated detection of budget overruns, tender discrepancies, and timeline delays using machine learning models.", icon: <IconTarget size={28} color="#EF4444" />, bg: "#FEF2F2" },
              { title: "Geo-Fenced Proof", desc: "Contractors must upload GPS-tagged photos from within the project site boundary to unlock payments.", icon: <IconMapPin size={28} color="#10B981" />, bg: "#ECFDF5" },
              { title: "Smart Contracts", desc: "Payment tranches are released automatically only when verified milestones are achieved.", icon: <IconCreditCard size={28} color="#3B82F6" />, bg: "#EFF6FF" },
              { title: "Citizen Audit", desc: "Local residents can rate project quality and report issues directly to the administration.", icon: <IconMegaphone size={28} color="#F59E0B" />, bg: "#FFFBEB" },
              { title: "Live Analytics", desc: "Real-time dashboards for ministers and officials to track progress across thousands of projects.", icon: <IconBarChart size={28} color="#8B5CF6" />, bg: "#F5F3FF" },
              { title: "Public Ledger", desc: "Complete history of every transaction and approval is available for public scrutiny.", icon: <IconSearch size={28} color="#6366F1" />, bg: "#EEF2FF" }
            ].map((feature, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="p-4 rounded-4 h-100 border border-light" style={{ backgroundColor: '#F9FAFB', transition: 'background 0.3s' }}>
                  <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-4" style={{ backgroundColor: feature.bg }}>
                    {feature.icon}
                  </div>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="text-secondary mb-0">{feature.desc}</p>
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
