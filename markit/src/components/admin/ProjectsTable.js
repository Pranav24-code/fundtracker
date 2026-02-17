import React, { useState } from 'react';
import { formatCurrency, getStatusBadgeClass } from '../../utils/formatters';
import { IconFolder, IconSearch, IconMapPin, IconFlag } from '../common/Icons';

const ProjectsTable = ({ projects = [] }) => {
    const [search, setSearch] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const filtered = projects.filter((p) => {
        const locationStr = typeof p.location === 'object' ? (p.location.city || p.location.address || '') : (p.location || '');
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || locationStr.toLowerCase().includes(search.toLowerCase());
        const matchDept = !filterDept || p.department === filterDept;
        const matchStatus = !filterStatus || p.status === filterStatus;
        return matchSearch && matchDept && matchStatus;
    });

    const departments = [...new Set(projects.map((p) => p.department))];
    const statuses = [...new Set(projects.map((p) => p.status))];

    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <div className="card-header bg-white py-3 px-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
                <div className="row align-items-center g-2">
                    <div className="col-md-4">
                        <h6 className="mb-0 fw-bold d-flex align-items-center gap-2"><IconFolder size={16} color="#3B82F6" /> All Projects</h6>
                    </div>
                    <div className="col-md-3">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-white"><IconSearch size={14} color="#9CA3AF" /></span>
                            <input className="form-control border-start-0" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderRadius: '0 8px 8px 0' }} />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <select className="form-select form-select-sm" value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{ borderRadius: 8 }}>
                            <option value="">All Depts</option>
                            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <select className="form-select form-select-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ borderRadius: 8 }}>
                            <option value="">All Status</option>
                            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ fontSize: 14 }}>
                    <thead style={{ backgroundColor: '#F9FAFB' }}>
                        <tr>
                            <th className="py-3 ps-4" style={{ fontWeight: 600, color: '#6B7280' }}>Project Name</th>
                            <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Location</th>
                            <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Budget</th>
                            <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Spent</th>
                            <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Completion</th>
                            <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Status</th>
                            <th className="py-3" style={{ fontWeight: 600, color: '#6B7280' }}>Risk</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((project) => {
                            const locationStr = typeof project.location === 'object' ? (project.location.city || project.location.address || '') : (project.location || '');
                            return (
                                <tr key={project._id || project.id} style={{ cursor: 'pointer' }}>
                                    <td className="py-3 ps-4">
                                        <div className="fw-semibold">{project.title}</div>
                                        <small className="text-muted">{project.department}</small>
                                    </td>
                                    <td className="py-3">
                                        <span className="d-flex align-items-center gap-1"><IconMapPin size={13} color="#6B7280" /> {locationStr}</span>
                                    </td>
                                    <td className="py-3">{formatCurrency(project.totalBudget)}</td>
                                    <td className="py-3">
                                        <div>{formatCurrency(project.amountSpent)}</div>
                                        <div className="progress mt-1" style={{ height: 4, width: 80 }}>
                                            <div className="progress-bar" style={{ width: `${(project.amountSpent / project.totalBudget) * 100}%`, backgroundColor: (project.amountSpent / project.totalBudget) > 0.9 ? '#EF4444' : '#3B82F6' }} />
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="position-relative" style={{ width: 40, height: 40 }}>
                                                <svg viewBox="0 0 36 36" style={{ width: 40, height: 40, transform: 'rotate(-90deg)' }}>
                                                    <circle cx="18" cy="18" r="15" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                                                    <circle cx="18" cy="18" r="15" fill="none" stroke={project.completionPercentage >= 70 ? '#10B981' : project.completionPercentage >= 40 ? '#F59E0B' : '#EF4444'} strokeWidth="3" strokeDasharray={`${project.completionPercentage * 0.94} 100`} />
                                                </svg>
                                                <span className="position-absolute top-50 start-50 translate-middle" style={{ fontSize: 10, fontWeight: 600 }}>{project.completionPercentage}%</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <span className={`badge ${getStatusBadgeClass(project.status)} rounded-pill`} style={{ fontSize: 11 }}>{project.status}</span>
                                    </td>
                                    <td className="py-3">
                                        {project.riskFlag ? (
                                            <span className="badge bg-danger rounded-pill d-flex align-items-center gap-1" style={{ fontSize: 11, width: 'fit-content' }}>
                                                <IconFlag size={10} color="#fff" /> Flagged
                                            </span>
                                        ) : (
                                            <span className="text-success fw-bold">✓</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan="7" className="text-center py-5 text-muted">No projects found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="card-footer bg-white text-muted text-center py-2" style={{ fontSize: 13 }}>
                Showing {filtered.length} of {projects.length} projects
            </div>
        </div>
    );
};

export default ProjectsTable;
