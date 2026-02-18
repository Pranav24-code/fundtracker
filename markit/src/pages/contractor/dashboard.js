import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SEO from '../../components/seo';
import ContractorSidebar from '../../components/layout/ContractorSidebar';
import StatsCard from '../../components/common/StatsCard';
import ProjectCard from '../../components/contractor/ProjectCard';
import ProgressUpdateForm from '../../components/contractor/ProgressUpdateForm';
import UpdatesTimeline from '../../components/contractor/UpdatesTimeline';
import { useAuth } from '../../context/AuthContext';
import { statsAPI, projectsAPI } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';
import { IconHardHat, IconClipboard, IconWallet, IconBarChart, IconClock, IconCreditCard } from '../../components/common/Icons';

const ContractorDashboard = () => {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'contractor')) {
            router.push('/auth/contractor-login');
            return;
        }
        if (user && user.role === 'contractor') {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, authLoading, router]);

    const fetchData = async () => {
        try {
            const [statsRes, projRes] = await Promise.all([
                statsAPI.getContractorStats(),
                projectsAPI.getAll({ limit: 50 }),
            ]);
            if (statsRes.success) setStats(statsRes.data);
            if (projRes.success) setProjects(projRes.data.projects);
        } catch (err) {
            console.error('Failed to fetch contractor data:', err);
        }
        setLoading(false);
    };

    if (authLoading || loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#FEE2E2' }}>
                <div className="spinner-border" style={{ color: '#EF4444' }} role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
        );
    }

    const completedProjects = projects.filter(p => (p.contractor?._id === user?._id || p.contractor === user?._id) && p.status === 'Completed');

    return (
        <>
            <SEO pageTitle="Contractor Dashboard - PETMS" />
            <div className="d-flex" style={{ backgroundColor: '#FEF2F2', minHeight: '100vh' }}>
                <ContractorSidebar />
                <main className="flex-grow-1" style={{ marginLeft: 260, padding: '24px 32px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#991B1B' }}>
                                <IconHardHat size={22} color="#EF4444" /> Contractor Dashboard
                            </h4>
                            <p className="text-muted mb-0" style={{ fontSize: 14 }}>Overview of your completed work and performance</p>
                        </div>
                        <div className="d-flex align-items-center gap-2 px-3 py-2 rounded" style={{ backgroundColor: '#FEE2E2', fontSize: 13 }}>
                            <div className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: '#EF4444' }}></div>
                            <span className="fw-medium" style={{ color: '#B91C1C' }}>{user?.name || 'Contractor'}</span>
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-md-3">
                            <StatsCard icon={<IconClipboard size={20} color="#EF4444" />} label="Completed Projects" value={stats?.completedProjects || completedProjects.length} subtext="Successfully delivered" color="red" />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconWallet size={20} color="#3B82F6" />} label="Total Earnings" value={formatCurrency(stats?.totalEarnings || 0)} subtext="From completed work" color="blue" />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconBarChart size={20} color="#10B981" />} label="Performance Score" value={`${stats?.performanceScore || 95}/100`} subtext="Based on timeliness" color="green" />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconClock size={20} color="#F59E0B" />} label="Active Projects" value={stats?.activeProjects || 0} subtext="Currently in progress" color="orange" />
                        </div>
                    </div>

                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><IconClipboard size={16} color="#991B1B" /> Completed Projects History</h6>

                    {completedProjects.length > 0 ? (
                        <div className="row g-4 mb-4">
                            {completedProjects.map((project) => (
                                <div key={project._id || project.id} className="col-md-6 col-lg-4">
                                    <ProjectCard project={{
                                        ...project,
                                        location: typeof project.location === 'object' ? project.location.city || project.location.address : project.location,
                                        endDate: project.actualEndDate || project.expectedEndDate,
                                    }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 mb-4 rounded-3" style={{ backgroundColor: '#FFF5F5', border: '1px dashed #FECACA' }}>
                            <IconClipboard size={48} color="#F87171" className="mb-3 opacity-50" />
                            <h6 className="text-danger fw-bold">No Completed Projects Yet</h6>
                            <p className="text-muted small mb-0">Projects will appear here once you mark them as 100% complete.</p>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default ContractorDashboard;
