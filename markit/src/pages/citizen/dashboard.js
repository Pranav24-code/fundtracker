import React, { useState, useEffect } from 'react';
import SEO from '../../components/seo';
import CitizenNavbar from '../../components/layout/CitizenNavbar';
import Footer from '../../components/layout/Footer';
import StatsCard from '../../components/common/StatsCard';
import ProjectGallery from '../../components/citizen/ProjectGallery';
import ComplaintForm from '../../components/citizen/ComplaintForm';
import { projectsAPI, authAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { IconBuilding, IconWallet, IconBarChart, IconMegaphone, IconSearch, IconArrowRight, IconUsers, IconCheckCircle } from '../../components/common/Icons';

const CitizenDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userPoints, setUserPoints] = useState(0);

    const { user } = useAuth(); // Get user from context

    useEffect(() => {
        fetchProjects();
        if (user) {
            // In a real app, we'd fetch fresh user stats here or rely on the context having them
            // For now, let's assume the user object in context might have points or we fetch it
            if (user.points) setUserPoints(user.points);
        }
    }, [user]);

    const fetchProjects = async () => {
        try {
            const res = await projectsAPI.getAll({ limit: 50 });
            if (res.success) setProjects(res.data.projects);

            // Refresh user data (if we had a specific endpoint for stats)
            const authRes = await authAPI.getMe();
            if (authRes.success) setUserPoints(authRes.data.user.points || 0);

        } catch (err) {
            console.error('Failed to fetch data:', err);
        }
        setLoading(false);
    };

    const totalBudget = projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);
    const avgCompletion = projects.length > 0
        ? Math.round(projects.reduce((sum, p) => sum + (p.completionPercentage || 0), 0) / projects.length)
        : 0;

    if (loading) {
        return (
            <>
                <CitizenNavbar />
                <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#F9FAFB' }}>
                    <div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO pageTitle="Citizen Dashboard - PETMS" />
            <CitizenNavbar />

            {/* Hero Section */}
            <section className="position-relative text-white" style={{
                background: 'linear-gradient(135deg, #065F46 0%, #047857 50%, #059669 100%)',
                paddingTop: '80px',
                paddingBottom: '140px',
                overflow: 'hidden'
            }}>
                {/* Abstract Pattern Overlay */}
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    opacity: 0.1,
                    backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 0%, transparent 20%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 20%)'
                }}></div>

                <div className="container position-relative z-index-1 text-center">
                    <span className="badge bg-white text-success rounded-pill px-3 py-2 mb-3 fw-bold" style={{ fontSize: 12, letterSpacing: '0.5px' }}>
                        TRANSPARENCY &bull; ACCOUNTABILITY &bull; PROGRESS
                    </span>
                    <h1 className="display-4 fw-bolder mb-3" style={{ lineHeight: 1.2 }}>
                        Building a Better Tomorrow, Together
                    </h1>
                    <p className="lead mb-5 opacity-75 mx-auto" style={{ maxWidth: 650 }}>
                        Track public spending in real-time. Monitor ongoing projects in your neighborhood and ensure every rupee is accounted for.
                    </p>

                    <div className="d-flex justify-content-center">
                        <div className="p-2 bg-white rounded-pill shadow-lg d-flex align-items-center" style={{ maxWidth: 600, width: '100%' }}>
                            <span className="ps-3 pe-2"><IconSearch size={20} color="#9CA3AF" /></span>
                            <input
                                className="form-control border-0 shadow-none bg-transparent"
                                placeholder="Search for projects, departments, or locations..."
                                style={{ fontSize: 16 }}
                            />
                            <button className="btn btn-success rounded-pill px-4 py-2 fw-bold">Search</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Overlapping */}
            <section className="py-0 position-relative z-index-2" style={{ marginTop: '-80px', marginBottom: '60px' }}>
                <div className="container">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <StatsCard icon={<IconBuilding size={24} />} label="Active Projects" value={projects.length} subtext="Across the city" color="green" />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconWallet size={24} />} label="Total Budget" value={formatCurrency(totalBudget)} subtext="Allocated funds" color="blue" />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconBarChart size={24} />} label="Avg. Completion" value={`${avgCompletion}%`} subtext="Progress rate" color="purple" progress={avgCompletion} />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconUsers size={24} />} label="My Impact Points" value={userPoints} subtext="Earned for contributing" color="orange" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured / Impact Section */}
            <section className="py-5 bg-white border-bottom">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-2">Making a Real Impact</h2>
                        <p className="text-muted">See how transparency is transforming our community</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="text-center p-4 rounded-4" style={{ backgroundColor: '#F0FDF4' }}>
                                <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm" style={{ width: 64, height: 64 }}>
                                    <IconCheckCircle size={32} color="#10B981" />
                                </div>
                                <h5 className="fw-bold">Faster Completion</h5>
                                <p className="text-muted small">Projects are completed 30% faster thanks to real-time monitoring and citizen oversight.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-4 rounded-4" style={{ backgroundColor: '#EFF6FF' }}>
                                <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm" style={{ width: 64, height: 64 }}>
                                    <IconWallet size={32} color="#3B82F6" />
                                </div>
                                <h5 className="fw-bold">Zero Leakage</h5>
                                <p className="text-muted small">Digital fund tracking ensures 100% of allocated budget reaches the intended development work.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-4 rounded-4" style={{ backgroundColor: '#FEF2F2' }}>
                                <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm" style={{ width: 64, height: 64 }}>
                                    <IconUsers size={32} color="#EF4444" />
                                </div>
                                <h5 className="fw-bold">Community Voice</h5>
                                <p className="text-muted small">Over 5,000 citizens are actively participating in governance and decision making.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content: Gallery & Forms */}
            <section className="py-5" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-8">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h3 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                    <IconBuilding size={24} color="#10B981" /> Explore Projects
                                </h3>
                                <button className="btn btn-outline-secondary btn-sm rounded-pill px-3">View All Projects</button>
                            </div>
                            <ProjectGallery projects={projects} />
                        </div>

                        <div className="col-lg-4">
                            <div className="sticky-top" style={{ top: 20 }}>
                                <div className="card border-0 shadow-sm border-top border-4 border-danger rounded-3" style={{ overflow: 'hidden' }}>
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                            <IconMegaphone size={20} color="#EF4444" /> Report an Issue
                                        </h5>
                                        <p className="text-muted small mb-4">
                                            Spot a delay, quality issue, or corruption? Report it anonymously. We take citizen feedback seriously.
                                        </p>
                                        <ComplaintForm projects={projects} />
                                    </div>
                                    <div className="bg-light p-3 text-center border-top">
                                        <small className="text-muted d-block mb-1">Need help?</small>
                                        <a href="#" className="fw-bold text-decoration-none text-danger">Call Helpline: 1800-PETMS-HELP</a>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 rounded-3 text-white" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}>
                                    <h5 className="fw-bold mb-2">Join the Community</h5>
                                    <p className="small opacity-75 mb-3">Sign up to get alerts about new projects in your area.</p>
                                    <button className="btn btn-sm btn-light w-100 rounded-pill text-primary fw-bold">Register Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default CitizenDashboard;
