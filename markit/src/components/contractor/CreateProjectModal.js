import React, { useState } from 'react';
import { projectsAPI } from '../../utils/api';
import { IconPlus, IconX } from '../common/Icons';

const CreateProjectModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        department: '',
        totalBudget: '',
        address: '',
        city: '',
        state: '',
        expectedEndDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                department: formData.department,
                totalBudget: formData.totalBudget,
                startDate: new Date().toISOString(),
                expectedEndDate: formData.expectedEndDate,
                location: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state
                }
            };

            const res = await projectsAPI.create(payload);
            if (res.success) {
                alert('Project created successfully!');
                onSuccess();
                onClose();
            } else {
                setError(res.message || 'Failed to create project');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while creating the project.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="bg-white rounded-4 shadow-lg d-flex flex-column" style={{ maxWidth: 600, width: '90%', maxHeight: '90vh' }}>
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
                    <h5 className="mb-0 fw-bold">Create New Project</h5>
                    <button className="btn btn-link text-dark p-0" onClick={onClose}><IconX size={24} /></button>
                </div>

                <div className="p-4 overflow-auto flex-grow-1">
                    {error && <div className="alert alert-danger py-2">{error}</div>}

                    <form id="createProjectForm" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-medium">Project Title</label>
                            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-medium">Description</label>
                            <textarea name="description" className="form-control" rows={3} value={formData.description} onChange={handleChange} required />
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-medium">Department</label>
                                <select name="department" className="form-select" value={formData.department} onChange={handleChange} required>
                                    <option value="">Select Department</option>
                                    <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Education">Education</option>
                                    <option value="Smart City">Smart City</option>
                                    <option value="Rural Development">Rural Development</option>
                                    <option value="Water Supply">Water Supply</option>
                                    <option value="Sanitation">Sanitation</option>
                                    <option value="Energy">Energy</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-medium">Total Budget (₹)</label>
                                <input type="number" name="totalBudget" className="form-control" value={formData.totalBudget} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-medium">Address</label>
                            <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} required />
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-medium">City</label>
                                <input type="text" name="city" className="form-control" value={formData.city} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-medium">State</label>
                                <input type="text" name="state" className="form-control" value={formData.state} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium">Expected End Date</label>
                            <input type="date" name="expectedEndDate" className="form-control" value={formData.expectedEndDate} onChange={handleChange} required />
                        </div>
                    </form>
                </div>

                <div className="p-3 border-top bg-light d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" form="createProjectForm" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
