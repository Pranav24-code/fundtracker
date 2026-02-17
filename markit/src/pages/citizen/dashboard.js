import React, { useState, useEffect } from 'react';
import SEO from '../../components/seo';
import CitizenNavbar from '../../components/layout/CitizenNavbar';
import Footer from '../../components/layout/Footer';
import StatsCard from '../../components/common/StatsCard';
import ProjectGallery from '../../components/citizen/ProjectGallery';
import ComplaintForm from '../../components/citizen/ComplaintForm';
import { projectsAPI } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';
import { IconBuilding, IconWallet, IconBarChart, IconMegaphone, IconSearch } from '../../components/common/Icons';

const CitizenDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await projectsAPI.getAll({ limit: 50 });
            if (res.success) setProjects(res.data.projects);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
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
                    <div className="spinner-border" style={{ color: '#10B981' }} role="status"><span className="visually-hidden">Loading...</span></div>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO pageTitle="Citizen Dashboard - PETMS" />
            <CitizenNavbar />

            <section className="text-center py-5" style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' }}>
                <div className="container">
                    <h2 className="fw-bold mb-2" style={{ color: '#065F46' }}>Monitor Public Projects in Your Area</h2>
                    <p className="text-muted mb-4" style={{ maxWidth: 600, margin: '0 auto', fontSize: 15 }}>
                        Track government spending, view project progress, and raise concerns for better transparency.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <div className="input-group" style={{ maxWidth: 500 }}>
                            <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '10px 0 0 10px' }}>
                                <IconSearch size={16} color="#9CA3AF" />
                            </span>
                            <input className="form-control border-start-0" placeholder="Search projects by name, location, or department..." style={{ borderRadius: '0 10px 10px 0', padding: '10px 16px' }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-4" style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB' }}>
                <div className="container">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <StatsCard icon={<IconBuilding size={20} color="#10B981" />} label="Total Projects" value={projects.length} subtext="Monitored" color="green" />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconWallet size={20} color="#3B82F6" />} label="Total Budget" value={formatCurrency(totalBudget)} subtext="Allocated" color="blue" />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconBarChart size={20} color="#F59E0B" />} label="Avg Completion" value={`${avgCompletion}%`} subtext="Across projects" color="orange" progress={avgCompletion} />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconMegaphone size={20} color="#EF4444" />} label="Risk Flagged" value={projects.filter(p => p.riskFlag).length} subtext="Projects" color="red" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <IconBuilding size={18} color="#10B981" /> Government Projects
                            </h5>
                            <ProjectGallery projects={projects} />
                        </div>
                        <div className="col-lg-4">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <IconMegaphone size={18} color="#EF4444" /> Raise a Concern
                            </h5>
                            <ComplaintForm projects={projects} />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default CitizenDashboard;
