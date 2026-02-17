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
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#FFFBEB' }}>
                <div className="spinner-border" style={{ color: '#F59E0B' }} role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
        );
    }

    const myProjects = projects.filter(p => p.contractor?._id === user?._id || p.contractor === user?._id);
    const displayProjects = myProjects.length > 0 ? myProjects : projects.slice(0, 5);

    return (
        <>
            <SEO pageTitle="Contractor Dashboard - PETMS" />
            <div className="d-flex" style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
                <ContractorSidebar />
                <main className="flex-grow-1" style={{ marginLeft: 260, padding: '24px 32px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#92400E' }}>
                                <IconHardHat size={22} color="#F59E0B" /> Contractor Dashboard
                            </h4>
                            <p className="text-muted mb-0" style={{ fontSize: 14 }}>Manage your projects and update progress</p>
                        </div>
                        <div className="d-flex align-items-center gap-2 px-3 py-2 rounded" style={{ backgroundColor: '#FEF3C7', fontSize: 13 }}>
                            <div className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: '#F59E0B' }}></div>
                            <span className="fw-medium" style={{ color: '#B45309' }}>{user?.name || 'Contractor'}</span>
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-md-3">
                            <StatsCard icon={<IconClipboard size={20} color="#F59E0B" />} label="My Projects" value={stats?.totalProjects || displayProjects.length} subtext="Assigned" color="orange" />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconWallet size={20} color="#3B82F6" />} label="Budget Assigned" value={formatCurrency(stats?.totalBudgetAssigned || 0)} subtext={`${stats?.totalProjects || 0} projects`} color="blue" />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconBarChart size={20} color="#10B981" />} label="Avg Completion" value={`${stats?.averageCompletion || 0}%`} subtext="Across projects" color="green" progress={parseFloat(stats?.averageCompletion || 0)} />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconClock size={20} color="#EF4444" />} label="Delayed" value={stats?.delayedProjects || 0} subtext="Need attention" color="red" />
                        </div>
                    </div>

                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><IconClipboard size={16} color="#92400E" /> My Projects</h6>
                    <div className="row g-4 mb-4">
                        {displayProjects.map((project) => (
                            <div key={project._id || project.id} className="col-md-6 col-lg-4">
                                <ProjectCard project={{
                                    ...project,
                                    location: typeof project.location === 'object' ? project.location.city || project.location.address : project.location,
                                    endDate: project.expectedEndDate,
                                }} />
                            </div>
                        ))}
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-lg-6">
                            <ProgressUpdateForm projects={displayProjects} />
                        </div>
                        <div className="col-lg-6">
                            <UpdatesTimeline />
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                        <div className="card-header bg-white py-3 px-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2"><IconCreditCard size={16} color="#F59E0B" /> Payment Tranches</h6>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
                                <thead style={{ backgroundColor: '#F9FAFB' }}>
                                    <tr>
                                        <th className="py-3 ps-4" style={{ fontWeight: 600, color: '#6B7280' }}>Tranche</th>
                                        <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Project</th>
                                        <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Amount</th>
                                        <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Status</th>
                                        <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { tranche: '1st Tranche (20%)', project: displayProjects[0]?.title || 'Project A', amount: '₹100 Cr', status: 'Received', date: '15 Mar 2024' },
                                        { tranche: '2nd Tranche (30%)', project: displayProjects[0]?.title || 'Project A', amount: '₹150 Cr', status: 'Received', date: '20 Jul 2024' },
                                        { tranche: '3rd Tranche (30%)', project: displayProjects[0]?.title || 'Project A', amount: '₹150 Cr', status: 'Pending', date: 'Est. Mar 2025' },
                                    ].map((t, i) => (
                                        <tr key={i}>
                                            <td className="py-3 ps-4 fw-medium">{t.tranche}</td>
                                            <td className="py-3">{t.project}</td>
                                            <td className="py-3 fw-semibold">{t.amount}</td>
                                            <td className="py-3">
                                                <span className={`badge rounded-pill ${t.status === 'Received' ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontSize: 11 }}>{t.status}</span>
                                            </td>
                                            <td className="py-3 text-muted">{t.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default ContractorDashboard;
