import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { IconSearch, IconMapPin, IconEye, IconBuilding } from '../common/Icons';

const deptColors = {
    'Roads & Infrastructure': '#3B82F6', 'Healthcare': '#EF4444', 'Education': '#8B5CF6',
    'Smart City': '#06B6D4', 'Water Supply': '#0EA5E9', 'Rural Development': '#F59E0B',
    'Energy': '#10B981', 'Sanitation': '#D946EF', 'Others': '#6B7280',
};

const ProjectGallery = ({ projects = [] }) => {
    const [search, setSearch] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const departments = [...new Set(projects.map((p) => p.department))];
    const filtered = projects.filter((p) => {
        const locationStr = typeof p.location === 'object' ? (p.location.city || p.location.address || '') : (p.location || '');
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || locationStr.toLowerCase().includes(search.toLowerCase());
        const matchDept = !filterDept || p.department === filterDept;
        return matchSearch && matchDept;
    });

    return (
        <div>
            <div className="d-flex gap-2 mb-4">
                <div className="input-group" style={{ maxWidth: 320 }}>
                    <span className="input-group-text bg-white"><IconSearch size={14} color="#9CA3AF" /></span>
                    <input className="form-control border-start-0" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderRadius: '0 8px 8px 0' }} />
                </div>
                <select className="form-select form-select-sm" value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{ borderRadius: 8, maxWidth: 200 }}>
                    <option value="">All Departments</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <div className="row g-3">
                {filtered.map((project) => {
                    const locationStr = typeof project.location === 'object' ? (project.location.city || project.location.address || '') : (project.location || '');
                    return (
                        <div key={project._id || project.id} className="col-md-6">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12, overflow: 'hidden', transition: 'transform 0.3s', cursor: 'pointer' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="px-4 py-3 text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: deptColors[project.department] || '#6B7280' }}>
                                    <span className="fw-medium d-flex align-items-center gap-2" style={{ fontSize: 12 }}>
                                        <IconBuilding size={13} color="#fff" /> {project.department}
                                    </span>
                                    <span className={`badge rounded-pill ${project.status === 'On Time' ? 'bg-light text-success' : project.status === 'Delayed' ? 'bg-light text-warning' : project.status === 'Completed' ? 'bg-light text-success' : 'bg-light text-danger'}`} style={{ fontSize: 10 }}>
                                        {project.status}
                                    </span>
                                </div>

                                <div className="card-body p-4">
                                    <h6 className="fw-bold mb-2" style={{ fontSize: 14 }}>{project.title}</h6>
                                    <p className="text-muted mb-2 d-flex align-items-center gap-1" style={{ fontSize: 12 }}>
                                        <IconMapPin size={12} color="#6B7280" /> {locationStr}
                                    </p>

                                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: 12 }}>
                                        <span className="text-muted">Budget: <span className="fw-semibold text-dark">{formatCurrency(project.totalBudget)}</span></span>
                                        <span className="text-muted">Spent: <span className="fw-semibold text-dark">{formatCurrency(project.amountSpent)}</span></span>
                                    </div>

                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1" style={{ fontSize: 11 }}>
                                            <span>Progress</span>
                                            <span className="fw-bold">{project.completionPercentage}%</span>
                                        </div>
                                        <div className="progress" style={{ height: 6 }}>
                                            <div className="progress-bar" style={{
                                                width: `${project.completionPercentage}%`,
                                                backgroundColor: project.completionPercentage >= 70 ? '#10B981' : project.completionPercentage >= 40 ? '#F59E0B' : '#EF4444',
                                            }} />
                                        </div>
                                    </div>

                                    {project.riskFlag && (
                                        <div className="mb-2">
                                            <span className="badge bg-danger rounded-pill" style={{ fontSize: 10 }}>⚠ Risk Flagged</span>
                                        </div>
                                    )}

                                    <button className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: '#F3F4F6', borderRadius: 8, fontSize: 12, color: '#374151' }}>
                                        <IconEye size={14} /> View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="col-12 text-center py-5 text-muted">No projects found</div>
                )}
            </div>
        </div>
    );
};

export default ProjectGallery;
