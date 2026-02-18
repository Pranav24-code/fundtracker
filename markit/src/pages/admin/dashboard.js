import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SEO from '../../components/seo';
import AdminSidebar from '../../components/layout/AdminSidebar';
import StatsCard from '../../components/common/StatsCard';
import ProjectsTable from '../../components/admin/ProjectsTable';
import AnalyticsCharts from '../../components/admin/AnalyticsCharts';
import RiskAlertsPanel from '../../components/admin/RiskAlertsPanel';
import ComplaintReviewModal from '../../components/admin/ComplaintReviewModal';
import { useAuth } from '../../context/AuthContext';
import { statsAPI, projectsAPI, complaintsAPI } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';
import { IconBarChart, IconWallet, IconTrendingUp, IconBuilding, IconAlertTriangle, IconClock, IconMessageSquare } from '../../components/common/Icons';

const AdminDashboard = () => {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

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
            const [statsRes, projectsRes, complaintsRes] = await Promise.all([
                statsAPI.getOverview(),
                projectsAPI.getAll({ limit: 50 }),
                complaintsAPI.getAll({ limit: 10, status: 'Pending' }), // Fetch pending complaints
            ]);
            if (statsRes.success) setStats(statsRes.data);
            if (projectsRes.success) setProjects(projectsRes.data.projects);
            if (complaintsRes.success) setComplaints(complaintsRes.data.complaints);
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

                    {/* Stats Cards */}
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
                            <ProjectsTable projects={projects} onRefresh={fetchData} />
                        </div>
                        <div className="col-lg-4">
                            {/* Recent Complaints Panel */}
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12, borderLeft: '4px solid #F59E0B' }}>
                                <div className="card-header bg-white py-3 px-4 d-flex align-items-center justify-content-between" style={{ borderBottom: '1px solid #FEF3C7' }}>
                                    <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                        <IconMessageSquare size={16} color="#F59E0B" /> Recent Complaints <span className="badge bg-warning text-dark rounded-pill ms-2">{complaints.length}</span>
                                    </h6>
                                </div>
                                <div className="card-body p-0" style={{ maxHeight: 380, overflowY: 'auto' }}>
                                    {complaints.length === 0 ? (
                                        <div className="text-center py-5 text-muted" style={{ fontSize: 14 }}>No pending complaints</div>
                                    ) : (
                                        complaints.map((complaint) => (
                                            <div key={complaint._id} className="px-4 py-3 cursor-pointer hover-bg-light" style={{ borderBottom: '1px solid #F3F4F6' }} onClick={() => setSelectedComplaint(complaint)}>
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <div className="fw-semibold mb-1" style={{ fontSize: 14 }}>{complaint.issueType}</div>
                                                        <div className="text-muted mb-2 text-truncate" style={{ fontSize: 13, maxWidth: 200 }}>{complaint.description}</div>
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <span className="badge rounded-pill bg-light text-dark border" style={{ fontSize: 10 }}>
                                                                {complaint.project?.title || 'Unknown Project'}
                                                            </span>
                                                            <small className="text-muted" style={{ fontSize: 11 }}>
                                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-sm btn-outline-primary" style={{ fontSize: 12, borderRadius: 6 }}>Review</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Keep Risk Alerts below or remove if redundant */}
                            {highRisk > 0 && <RiskAlertsPanel projects={projects} />}
                        </div>
                    </div>
                </main>

                {/* Complaint Review Modal */}
                {selectedComplaint && (
                    <ComplaintReviewModal
                        complaint={selectedComplaint}
                        onClose={() => setSelectedComplaint(null)}
                        onSuccess={() => {
                            setSelectedComplaint(null);
                            fetchData();
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default AdminDashboard;
