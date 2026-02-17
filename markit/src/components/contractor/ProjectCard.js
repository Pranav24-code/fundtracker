import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { IconMapPin, IconClock, IconFlag } from '../common/Icons';

const ProjectCard = ({ project }) => {
    const getBorderColor = () => {
        if (project.riskFlag) return '#EF4444';
        if (project.status === 'Delayed') return '#F59E0B';
        return '#10B981';
    };

    const daysLeft = Math.max(0, Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)));
    const spentPercent = ((project.amountSpent / project.totalBudget) * 100).toFixed(0);

    return (
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12, borderTop: `4px solid ${getBorderColor()}` }}>
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 className="fw-bold mb-1" style={{ fontSize: 15 }}>{project.title}</h6>
                        <small className="text-muted d-flex align-items-center gap-1"><IconMapPin size={12} color="#6B7280" /> {project.location}</small>
                    </div>
                    {project.riskFlag && (
                        <span className="badge bg-danger rounded-pill d-flex align-items-center gap-1" style={{ fontSize: 10 }}>
                            <IconFlag size={10} color="#fff" /> Risk
                        </span>
                    )}
                </div>

                <div className="mt-3 mb-2" style={{ fontSize: 13 }}>
                    <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Budget:</span>
                        <span className="fw-semibold">{formatCurrency(project.totalBudget)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Spent:</span>
                        <span className="fw-semibold">{formatCurrency(project.amountSpent)} ({spentPercent}%)</span>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: 12 }}>
                        <span className="text-muted">Completion</span>
                        <span className="fw-bold" style={{ color: project.completionPercentage >= 70 ? '#10B981' : project.completionPercentage >= 40 ? '#F59E0B' : '#EF4444' }}>
                            {project.completionPercentage}%
                        </span>
                    </div>
                    <div className="progress" style={{ height: 8, borderRadius: 4 }}>
                        <div className="progress-bar" style={{
                            width: `${project.completionPercentage}%`,
                            backgroundColor: project.completionPercentage >= 70 ? '#10B981' : project.completionPercentage >= 40 ? '#F59E0B' : '#EF4444',
                            borderRadius: 4, transition: 'width 0.6s ease'
                        }} />
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-2" style={{ borderTop: '1px solid #F3F4F6', fontSize: 12 }}>
                    <span className="text-muted d-flex align-items-center gap-1"><IconClock size={12} color="#6B7280" /> {daysLeft} days left</span>
                    <span className={`badge rounded-pill ${project.status === 'On Time' ? 'bg-success' : project.status === 'Delayed' ? 'bg-warning text-dark' : 'bg-danger'}`} style={{ fontSize: 10 }}>
                        {project.status}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
