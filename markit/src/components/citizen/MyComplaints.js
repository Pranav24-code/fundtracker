import React from 'react';
import { IconClipboard, IconHeart } from '../common/Icons';

const MyComplaints = ({ complaints = [], loading = false }) => {
    const getStatusStyle = (status) => {
        const styles = {
            'Pending': { bg: '#FEF2F2', color: '#991B1B', badge: 'bg-danger' },
            'Under Review': { bg: '#FFFBEB', color: '#92400E', badge: 'bg-warning text-dark' },
            'Resolved': { bg: '#ECFDF5', color: '#065F46', badge: 'bg-success' },
            'Closed': { bg: '#F3F4F6', color: '#374151', badge: 'bg-secondary' },
        };
        return styles[status] || styles['Pending'];
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <div className="card-header bg-white py-3 px-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
                <h6 className="mb-0 fw-bold d-flex align-items-center gap-2"><IconClipboard size={16} color="#10B981" /> My Complaints</h6>
            </div>
            <div className="card-body p-0">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border spinner-border-sm text-success" role="status" />
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="text-center py-5 text-muted" style={{ fontSize: 14 }}>No complaints submitted yet</div>
                ) : (
                    complaints.map((complaint) => {
                        const s = getStatusStyle(complaint.status);
                        return (
                            <div key={complaint._id || complaint.id} className="px-4 py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div className="fw-semibold" style={{ fontSize: 14 }}>{complaint.project?.title || complaint.projectTitle || 'N/A'}</div>
                                        <div className="text-muted" style={{ fontSize: 12 }}>{complaint.issueType} · #{complaint.trackingId || complaint._id}</div>
                                        <p className="text-muted mt-1 mb-2" style={{ fontSize: 13 }}>{complaint.description}</p>
                                        <div className="d-flex align-items-center gap-3">
                                            <span className={`badge ${s.badge} rounded-pill`} style={{ fontSize: 10 }}>{complaint.status}</span>
                                            <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
                                                <IconHeart size={12} color={complaint.upvotes >= 100 ? '#EF4444' : '#9CA3AF'} /> {complaint.upvotes || 0}
                                            </span>
                                            <small className="text-muted">{formatDate(complaint.createdAt || complaint.submittedDate)}</small>
                                        </div>
                                    </div>
                                </div>
                                {complaint.adminResponse?.message && (
                                    <div className="mt-2 p-2 rounded" style={{ backgroundColor: '#EFF6FF', fontSize: 12 }}>
                                        <span className="fw-semibold" style={{ color: '#1D4ED8' }}>Admin Response:</span> {complaint.adminResponse.message}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyComplaints;
