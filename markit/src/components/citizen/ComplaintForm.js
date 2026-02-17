import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { complaintsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { IconSend, IconCamera, IconUpload } from '../common/Icons';

const issueTypes = ['Poor Quality', 'Work Stopped', 'Budget Misuse', 'Timeline Delay', 'Other'];

const ComplaintForm = ({ projects = [] }) => {
    const { isAuthenticated, isCitizen } = useAuth();
    const [selectedProject, setSelectedProject] = useState('');
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated || !isCitizen) {
            toast.error('Please login as a citizen to submit complaints');
            return;
        }
        if (!issueType) {
            toast.warning('Please select an issue type');
            return;
        }
        setSubmitting(true);
        try {
            const res = await complaintsAPI.submit({
                projectId: selectedProject,
                issueType,
                description,
            });
            if (res.success) {
                toast.success(`Complaint submitted! Tracking ID: ${res.data.trackingId}`);
                setSelectedProject('');
                setIssueType('');
                setDescription('');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to submit complaint');
        }
        setSubmitting(false);
    };

    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12, borderTop: '3px solid #10B981' }}>
            <div className="card-body p-4">
                <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><IconSend size={16} color="#10B981" /> Submit a Complaint</h6>

                {!isAuthenticated && (
                    <div className="alert alert-info py-2" style={{ fontSize: 13, borderRadius: 8 }}>
                        Please <Link href="/auth/citizen-login"><a>login as a citizen</a></Link> to submit complaints.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-medium" style={{ fontSize: 13 }}>Select Project</label>
                        <select className="form-select" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} required style={{ borderRadius: 8 }}>
                            <option value="">-- Choose Project --</option>
                            {projects.map((p) => (
                                <option key={p._id || p.id} value={p._id || p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-medium" style={{ fontSize: 13 }}>Issue Type</label>
                        <div className="d-flex flex-wrap gap-2">
                            {issueTypes.map((type) => (
                                <button
                                    key={type} type="button"
                                    className={`btn btn-sm rounded-pill ${issueType === type ? 'text-white' : 'btn-outline-secondary'}`}
                                    style={{ fontSize: 11, backgroundColor: issueType === type ? '#10B981' : undefined, borderColor: issueType === type ? '#10B981' : undefined }}
                                    onClick={() => setIssueType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-medium" style={{ fontSize: 13 }}>Describe the Issue</label>
                        <textarea className="form-control" rows={3} placeholder="Describe the problem you observed (min 10 characters)..." value={description} onChange={(e) => setDescription(e.target.value)} required minLength={10} style={{ borderRadius: 8 }} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-medium d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                            <IconCamera size={14} color="#6B7280" /> Upload Evidence
                        </label>
                        <div className="border rounded p-4 text-center" style={{ borderStyle: 'dashed', borderColor: '#D1D5DB', backgroundColor: '#FAFAFA', borderRadius: 8, cursor: 'pointer' }}>
                            <div className="d-flex justify-content-center mb-2"><IconUpload size={28} color="#9CA3AF" /></div>
                            <div className="text-muted" style={{ fontSize: 12 }}>Drag & drop photos/videos</div>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }}>Cancel</button>
                        <button type="submit" className="btn btn-sm text-white flex-grow-1" style={{ backgroundColor: '#10B981', borderRadius: 8 }} disabled={submitting || !isAuthenticated}>
                            {submitting ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComplaintForm;
