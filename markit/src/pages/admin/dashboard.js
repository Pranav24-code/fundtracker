import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SEO from '../../components/seo';
import AdminSidebar from '../../components/layout/AdminSidebar';
import StatsCard from '../../components/common/StatsCard';
import ProjectsTable from '../../components/admin/ProjectsTable';
import AnalyticsCharts from '../../components/admin/AnalyticsCharts';
import RiskAlertsPanel from '../../components/admin/RiskAlertsPanel';
import { useAuth } from '../../context/AuthContext';
import { statsAPI, projectsAPI } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';
import { IconBarChart, IconWallet, IconTrendingUp, IconBuilding, IconAlertTriangle, IconClock } from '../../components/common/Icons';

const AdminDashboard = () => {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/auth/admin-login');
            return;
        }
        if (user && user.role === 'admin') {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, authLoading, router]);

    const fetchData = async () => {
        try {
            const [statsRes, projectsRes] = await Promise.all([
                statsAPI.getOverview(),
                projectsAPI.getAll({ limit: 50 }),
            ]);
            if (statsRes.success) setStats(statsRes.data);
            if (projectsRes.success) setProjects(projectsRes.data.projects);
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
        }
        setLoading(false);
    };

    if (authLoading || loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
        );
    }

    const totalBudget = stats?.totalBudgetAllocated || 0;
    const totalSpent = stats?.totalBudgetSpent || 0;
    const activeProjects = stats?.activeProjects || 0;
    const highRisk = stats?.riskFlaggedProjects || 0;
    const utilization = stats?.utilizationPercentage || 0;

    return (
        <>
            <SEO pageTitle="Admin Dashboard - PETMS" />
            <div className="d-flex" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
                <AdminSidebar />
                <main className="flex-grow-1" style={{ marginLeft: 260, padding: '24px 32px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#111827' }}>
                                <IconBarChart size={22} color="#3B82F6" /> Admin Dashboard
                            </h4>
                            <p className="text-muted mb-0" style={{ fontSize: 14 }}>Overview of all government projects and expenditures</p>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <span className="badge bg-light text-dark px-3 py-2 d-flex align-items-center gap-1" style={{ fontSize: 12, borderRadius: 8 }}>
                                <IconClock size={12} color="#6B7280" /> Last updated: Just now
                            </span>
                            <div className="d-flex align-items-center gap-2 px-3 py-2 rounded" style={{ backgroundColor: '#EFF6FF', fontSize: 13 }}>
                                <div className="rounded-circle bg-primary" style={{ width: 8, height: 8 }}></div>
                                <span className="fw-medium" style={{ color: '#1D4ED8' }}>{user?.name || 'Admin'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-md-3">
                            <StatsCard icon={<IconWallet size={20} color="#3B82F6" />} label="Total Budget" value={formatCurrency(totalBudget)} subtext={`${activeProjects} projects`} color="blue" progress={65} />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconTrendingUp size={20} color="#10B981" />} label="Total Spent" value={formatCurrency(totalSpent)} subtext={`${utilization}% utilized`} color="green" progress={parseFloat(utilization)} />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconBuilding size={20} color="#F59E0B" />} label="Active Projects" value={activeProjects} subtext="Monitored" color="orange" />
                        </div>
                        <div className="col-md-3">
                            <StatsCard icon={<IconAlertTriangle size={20} color="#EF4444" />} label="High Risk" value={highRisk} subtext="Need attention" color="red" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <AnalyticsCharts projects={projects} />
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-lg-8">
                            <ProjectsTable projects={projects} />
                        </div>
                        <div className="col-lg-4">
                            <RiskAlertsPanel projects={projects} />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default AdminDashboard;
