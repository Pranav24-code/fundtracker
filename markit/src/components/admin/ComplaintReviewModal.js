import React, { useState } from 'react';
import { complaintsAPI } from '../../utils/api';
import { IconX, IconCheck, IconMessageSquare, IconImage } from '../common/Icons';

const ComplaintReviewModal = ({ complaint, onClose, onSuccess }) => {
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('Resolved'); // 'Resolved' | 'Investigating'
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await complaintsAPI.respond(complaint._id, { message: response, status });
            if (res.success) {
                alert('Response submitted successfully');
                onSuccess();
            } else {
                alert('Failed to submit response');
            }
        } catch (err) {
            console.error(err);
            const errMsg = err.message || JSON.stringify(err);
            alert(`Error submitting response: ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="bg-white rounded-4 shadow-lg d-flex flex-column" style={{ maxWidth: 700, width: '90%', maxHeight: '90vh' }}>
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
                    <h5 className="mb-0 fw-bold">Review Complaint</h5>
                    <button className="btn btn-link text-dark p-0" onClick={onClose}><IconX size={24} /></button>
                </div>

                <div className="p-4 overflow-auto flex-grow-1">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <h6 className="fw-bold mb-3">Complaint Details</h6>
                            <div className="mb-3">
                                <label className="text-muted small">Issue Type</label>
                                <div className="fw-medium">{complaint.issueType}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Project</label>
                                <div className="fw-medium">{complaint.project?.title || 'Unknown Project'}</div>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Description</label>
                                <p className="bg-light p-3 rounded-3 mb-0" style={{ fontSize: 14 }}>{complaint.description}</p>
                            </div>
                            <div className="mb-3">
                                <label className="text-muted small">Citizen</label>
                                <div>{complaint.citizen?.name} ({complaint.citizen?.email})</div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <h6 className="fw-bold mb-3">Evidence</h6>
                            {complaint.images && complaint.images.length > 0 ? (
                                <div className="d-flex flex-wrap gap-2">
                                    {complaint.images.map((img, idx) => (
                                        <div key={idx} className="position-relative" style={{ width: '100%', height: 200, borderRadius: 8, overflow: 'hidden', border: '1px solid #dee2e6' }}>
                                            <img src={img.url} alt={`Evidence ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center bg-light rounded-3 h-100" style={{ minHeight: 150 }}>
                                    <IconImage size={32} color="#adb5bd" />
                                    <span className="text-muted mt-2 small">No images attached</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="my-4" />

                    <h6 className="fw-bold mb-3">Admin Response</h6>
                    <form id="responseForm" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-medium">Status Update</label>
                            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Resolved">Mark as Resolved</option>
                                <option value="Under Review">Mark as Investigating</option>
                                <option value="Rejected">Reject Complaint</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-medium">Response Message</label>
                            <textarea
                                className="form-control"
                                rows={4}
                                placeholder="Explain the action taken..."
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                required
                            ></textarea>
                        </div>
                    </form>
                </div>

                <div className="p-3 border-top bg-light d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" form="responseForm" className="btn btn-primary d-flex align-items-center gap-2" disabled={loading}>
                        {loading ? 'Submitting...' : <><IconCheck size={18} /> Submit Response</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComplaintReviewModal;
