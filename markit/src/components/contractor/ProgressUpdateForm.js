import React, { useState } from 'react';
import { projectsAPI } from '../../utils/api';
import { IconSend, IconCamera, IconUpload, IconCheck } from '../common/Icons';

const ProgressUpdateForm = ({ projectId, onSuccess }) => {
    const [completion, setCompletion] = useState(0);
    const [amountSpent, setAmountSpent] = useState('');
    const [notes, setNotes] = useState('');
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [gpsLocation, setGpsLocation] = useState(null);

    // Get GPS location on mount
    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setGpsLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (err) => {
                    console.warn("GPS Access Denied or Error:", err.message);
                    // Don't block, just continue without GPS
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        }
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('progressPercentage', completion);
            formData.append('description', notes);
            formData.append('budgetUsedThisUpdate', amountSpent);
            if (gpsLocation) {
                formData.append('gpsData', JSON.stringify(gpsLocation));
            }

            files.forEach((file) => {
                formData.append('images', file);
            });

            const res = await projectsAPI.submitUpdate(projectId, formData);
            if (res.success) {
                alert('Progress update submitted successfully!');
                if (onSuccess) onSuccess();
            } else {
                setError(res.message || 'Failed to submit update');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while submitting the update.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12, borderTop: '3px solid #F59E0B' }}>
            <div className="card-body p-4">
                <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><IconSend size={16} color="#F59E0B" /> Update Project Progress</h6>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-medium" style={{ fontSize: 13 }}>Completion: {completion}%</label>
                        <input type="range" className="form-range" min="0" max="100" value={completion} onChange={(e) => setCompletion(e.target.value)} />
                        <div className="progress" style={{ height: 6, borderRadius: 3 }}>
                            <div className="progress-bar" style={{ width: `${completion}%`, backgroundColor: '#F59E0B', borderRadius: 3 }} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-medium" style={{ fontSize: 13 }}>Amount Spent (₹ Cr)</label>
                        <input type="number" className="form-control" placeholder="e.g. 0.5" value={amountSpent} onChange={(e) => setAmountSpent(e.target.value)} style={{ borderRadius: 8 }} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-medium d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                            <IconCamera size={14} color="#6B7280" /> Upload Photos
                        </label>
                        <input type="file" className="form-control" multiple accept="image/*" onChange={handleFileChange} />
                        <div className="form-text">
                            {gpsLocation ? <span className="text-success"><IconCheck size={12} /> GPS Location Detected</span> : <span className="text-warning">Enabling GPS...</span>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-medium" style={{ fontSize: 13 }}>Notes</label>
                        <textarea className="form-control" rows={3} placeholder="Describe work done, issues faced..." value={notes} onChange={(e) => setNotes(e.target.value)} style={{ borderRadius: 8 }} required />
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                        <button type="button" className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }} onClick={onSuccess}>Cancel</button>
                        <button type="submit" className="btn btn-sm text-white" style={{ backgroundColor: '#F59E0B', borderRadius: 8 }} disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProgressUpdateForm;
