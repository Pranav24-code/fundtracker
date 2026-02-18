import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SEO from '../../components/seo';
import AdminSidebar from '../../components/layout/AdminSidebar';
import ComplaintReviewModal from '../../components/admin/ComplaintReviewModal';
import { useAuth } from '../../context/AuthContext';
import { complaintsAPI } from '../../utils/api';
import { IconAlertTriangle, IconHeart } from '../../components/common/Icons';

const AdminComplaints = () => {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/auth/admin-login');
            return;
        }
        if (user && user.role === 'admin') {
            fetchComplaints();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, authLoading, router]);

    const fetchComplaints = async () => {
        try {
            const res = await complaintsAPI.getAll({ limit: 50 });
            if (res.success) setComplaints(res.data.complaints);
        } catch (err) {
            console.error('Failed to fetch complaints:', err);
        }
        setLoading(false);
    };

    const getStatusStyle = (status) => {
        const styles = {
            'Pending': { badge: 'bg-danger' },
            'Under Review': { badge: 'bg-warning text-dark' },
            'Resolved': { badge: 'bg-success' },
            'Closed': { badge: 'bg-secondary' },
        };
        return styles[status] || styles['Pending'];
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (authLoading || loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
        );
    }

    const pendingCount = complaints.filter(c => c.status === 'Pending').length;
    const reviewCount = complaints.filter(c => c.status === 'Under Review').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

    return (
        <>
            <SEO pageTitle="Complaints Management - PETMS Admin" />
            <div className="d-flex" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
                <AdminSidebar />
                <main className="flex-grow-1" style={{ marginLeft: 260, padding: '24px 32px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
                                <IconAlertTriangle size={20} color="#EF4444" /> Complaints Management
                            </h4>
                            <p className="text-muted" style={{ fontSize: 14 }}>Review and respond to citizen complaints</p>
                        </div>
                        <div className="d-flex gap-2">
                            <span className="badge bg-danger px-3 py-2">Pending: {pendingCount}</span>
                            <span className="badge bg-warning text-dark px-3 py-2">Under Review: {reviewCount}</span>
                            <span className="badge bg-success px-3 py-2">Resolved: {resolvedCount}</span>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
                                <thead style={{ backgroundColor: '#F9FAFB' }}>
                                    <tr>
                                        <th className="py-3 ps-4" style={{ fontWeight: 600, color: '#6B7280' }}>Tracking ID</th>
                                        <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Project</th>
                                        <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Issue Type</th>
                                        <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>By</th>
                                        <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Upvotes</th>
                                        <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Status</th>
                                        <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Date</th>
                                        <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.map((item) => {
                                        const s = getStatusStyle(item.status);
                                        return (
                                            <tr key={item._id}>
                                                <td className="py-3 ps-4 fw-semibold" style={{ fontSize: 13, color: '#6B7280' }}>{item.trackingId}</td>
                                                <td className="py-3">
                                                    <div className="fw-semibold">{item.project?.title || 'N/A'}</div>
                                                </td>
                                                <td className="py-3">{item.issueType}</td>
                                                <td className="py-3">{item.citizen?.name || 'N/A'}</td>
                                                <td className="py-3">
                                                    <span className="fw-semibold d-flex align-items-center gap-1" style={{ color: item.upvotes >= 100 ? '#EF4444' : '#374151' }}>
                                                        <IconHeart size={12} color={item.upvotes >= 100 ? '#EF4444' : '#9CA3AF'} /> {item.upvotes}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`badge ${s.badge} rounded-pill`} style={{ fontSize: 11 }}>{item.status}</span>
                                                </td>
                                                <td className="py-3 text-muted" style={{ fontSize: 12 }}>{formatDate(item.createdAt)}</td>
                                                <td className="py-3">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        style={{ fontSize: 11, borderRadius: 6 }}
                                                        onClick={() => setSelectedComplaint(item)}
                                                    >
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {complaints.length === 0 && (
                                        <tr><td colSpan="8" className="text-center py-5 text-muted">No complaints found</td></tr>
                                    )}
                                </tbody>
                            </table>
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
                            fetchComplaints();
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default AdminComplaints;
