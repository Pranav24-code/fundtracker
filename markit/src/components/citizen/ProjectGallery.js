import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '../../utils/formatters';
import { IconSearch, IconMapPin, IconEye, IconBuilding, IconArrowRight } from '../common/Icons';

const deptColors = {
    'Roads & Infrastructure': { primary: '#3B82F6', gradient: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)' },
    'Healthcare': { primary: '#EF4444', gradient: 'linear-gradient(135deg, #F87171 0%, #DC2626 100%)' },
    'Education': { primary: '#8B5CF6', gradient: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)' },
    'Smart City': { primary: '#06B6D4', gradient: 'linear-gradient(135deg, #22D3EE 0%, #0891B2 100%)' },
    'Water Supply': { primary: '#0EA5E9', gradient: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)' },
    'Rural Development': { primary: '#F59E0B', gradient: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)' },
    'Energy': { primary: '#10B981', gradient: 'linear-gradient(135deg, #34D399 0%, #059669 100%)' },
    'Sanitation': { primary: '#D946EF', gradient: 'linear-gradient(135deg, #E879F9 0%, #C026D3 100%)' },
    'Others': { primary: '#6B7280', gradient: 'linear-gradient(135deg, #9CA3AF 0%, #4B5563 100%)' },
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
            <div className="d-flex flex-wrap gap-2 mb-4">
                <div className="input-group shadow-sm border-0" style={{ maxWidth: 320, borderRadius: 10, overflow: 'hidden' }}>
                    <span className="input-group-text bg-white border-0 ps-3"><IconSearch size={16} color="#9CA3AF" /></span>
                    <input className="form-control border-0 bg-white" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ fontSize: 14 }} />
                </div>
                <select className="form-select border-0 shadow-sm" value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{ borderRadius: 10, maxWidth: 200, fontSize: 14, cursor: 'pointer' }}>
                    <option value="">All Departments</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <div className="row g-4">
                {filtered.map((project) => {
                    const locationStr = typeof project.location === 'object' ? (project.location.city || project.location.address || '') : (project.location || '');
                    const theme = deptColors[project.department] || deptColors['Others'];
                    return (
                        <div key={project._id || project.id} className="col-md-6 col-lg-6">
                            <div className="card border-0 h-100 shadow-sm project-card" style={{ borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s' }}>
                                {/* Visual Header Area */}
                                <div style={{ height: 140, background: theme.gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconBuilding size={64} color="rgba(255,255,255,0.2)" />
                                    <span className="badge position-absolute top-0 end-0 m-3 shadow-sm"
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.95)',
                                            color: project.status === 'Delayed' ? '#EF4444' : '#059669',
                                            borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 600
                                        }}>
                                        {project.status === 'Delayed' ? '⚠ Delayed' : project.status}
                                    </span>
                                </div>

                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <span className="badge rounded-pill" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary, fontSize: 10 }}>
                                            {project.department}
                                        </span>
                                        {project.riskFlag && <span className="badge bg-danger rounded-pill" style={{ fontSize: 10 }}>Critical Risk</span>}
                                    </div>

                                    <h5 className="fw-bold text-dark mb-1" style={{ fontSize: 16, lineHeight: 1.4 }}>{project.title}</h5>

                                    <p className="text-muted d-flex align-items-center gap-1 mb-3" style={{ fontSize: 13 }}>
                                        <IconMapPin size={14} color="#9CA3AF" /> {locationStr}
                                    </p>

                                    <div className="mb-4 p-3 bg-light rounded-3">
                                        <div className="d-flex justify-content-between mb-1" style={{ fontSize: 12 }}>
                                            <span className="text-secondary fw-medium">Completion</span>
                                            <span className="fw-bold text-dark">{project.completionPercentage}%</span>
                                        </div>
                                        <div className="progress mb-2" style={{ height: 6, backgroundColor: '#E5E7EB', borderRadius: 10 }}>
                                            <div className="progress-bar" style={{
                                                width: `${project.completionPercentage}%`,
                                                backgroundColor: theme.primary,
                                                borderRadius: 10
                                            }} />
                                        </div>
                                        <div className="d-flex justify-content-between pt-1 border-top border-white" style={{ fontSize: 11 }}>
                                            <span className="text-muted">Budget: <span className="fw-semibold text-dark">{formatCurrency(project.totalBudget)}</span></span>
                                            <span className="text-muted">Spent: <span className="fw-semibold text-dark">{formatCurrency(project.amountSpent)}</span></span>
                                        </div>
                                    </div>

                                    <Link href={`/projects/${project._id || project.id}`}>
                                        <a className="btn w-100 fw-medium d-flex align-items-center justify-content-center gap-2"
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: `1px solid ${theme.primary}`,
                                                color: theme.primary,
                                                borderRadius: 10,
                                                padding: '10px',
                                                fontSize: 13,
                                                transition: 'all 0.2s',
                                                textDecoration: 'none'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.primary; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.primary; }}
                                        >
                                            View Project Details <IconArrowRight size={14} />
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <div className="mb-3"><IconSearch size={48} color="#D1D5DB" /></div>
                        <h6 className="text-muted">No projects found matching your criteria</h6>
                    </div>
                )}
            </div>

            <style jsx>{`
                .project-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; }
            `}</style>
        </div>
    );
};

export default ProjectGallery;
