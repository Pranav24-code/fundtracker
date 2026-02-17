import React, { useState } from 'react';
import projectData from '../../data/projectData';
import { IconSend, IconCamera, IconUpload } from '../common/Icons';

const ProgressUpdateForm = () => {
    const [selectedProject, setSelectedProject] = useState('');
    const [completion, setCompletion] = useState(0);
    const [amountSpent, setAmountSpent] = useState('');
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const contractorProjects = projectData.filter((p, i) => i < 5);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setSelectedProject('');
        setCompletion(0);
        setAmountSpent('');
        setNotes('');
    };

    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12, borderTop: '3px solid #F59E0B' }}>
            <div className="card-body p-4">
                <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><IconSend size={16} color="#F59E0B" /> Update Project Progress</h6>

                {submitted && (
                    <div className="alert alert-success py-2" style={{ fontSize: 13, borderRadius: 8 }}>
                        Progress update submitted successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-medium" style={{ fontSize: 13 }}>Select Project</label>
                        <select className="form-select" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} required style={{ borderRadius: 8 }}>
                            <option value="">-- Choose Project --</option>
                            {contractorProjects.map((p) => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-medium" style={{ fontSize: 13 }}>Completion: {completion}%</label>
                        <input type="range" className="form-range" min="0" max="100" value={completion} onChange={(e) => setCompletion(e.target.value)} />
                        <div className="progress" style={{ height: 6, borderRadius: 3 }}>
                            <div className="progress-bar" style={{ width: `${completion}%`, backgroundColor: '#F59E0B', borderRadius: 3 }} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-medium" style={{ fontSize: 13 }}>Amount Spent (₹ Cr)</label>
                        <input type="number" className="form-control" placeholder="e.g. 35" value={amountSpent} onChange={(e) => setAmountSpent(e.target.value)} style={{ borderRadius: 8 }} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-medium d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                            <IconCamera size={14} color="#6B7280" /> Upload Photos (GPS-tagged)
                        </label>
                        <div className="border rounded p-4 text-center" style={{ borderStyle: 'dashed', borderColor: '#D1D5DB', backgroundColor: '#FAFAFA', borderRadius: 8, cursor: 'pointer' }}>
                            <div className="d-flex justify-content-center mb-2"><IconUpload size={28} color="#9CA3AF" /></div>
                            <div className="text-muted mt-1" style={{ fontSize: 12 }}>Drag & drop or click to upload</div>
                            <small className="text-warning">Photos must be within 5km of project site</small>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-medium" style={{ fontSize: 13 }}>Notes</label>
                        <textarea className="form-control" rows={3} placeholder="Describe progress made..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ borderRadius: 8 }} />
                    </div>

                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }}>Cancel</button>
                        <button type="submit" className="btn btn-sm text-white" style={{ backgroundColor: '#F59E0B', borderRadius: 8 }}>Submit Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProgressUpdateForm;
