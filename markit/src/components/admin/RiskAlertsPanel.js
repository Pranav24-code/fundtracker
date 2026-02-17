import React from 'react';
import { IconAlertTriangle, IconMapPin, IconDollarSign, IconTrendingUp, IconMegaphone, IconClock } from '../common/Icons';

const riskTypeLabels = {
    'BUDGET_OVERRUN': 'Budget Overrun',
    'TIMELINE_DELAY': 'Timeline Delay',
    'BUDGET_SPIKE': 'Budget Spike',
    'GPS_FRAUD': 'GPS Fraud',
    'PUBLIC_CONCERN': 'Public Concern',
};

const alertIcons = {
    'BUDGET_OVERRUN': <IconDollarSign size={14} color="#991B1B" />,
    'TIMELINE_DELAY': <IconClock size={14} color="#92400E" />,
    'BUDGET_SPIKE': <IconTrendingUp size={14} color="#991B1B" />,
    'GPS_FRAUD': <IconMapPin size={14} color="#991B1B" />,
    'PUBLIC_CONCERN': <IconMegaphone size={14} color="#92400E" />,
};

const RiskAlertsPanel = ({ projects = [] }) => {
    // Build alerts from risk-flagged projects
    const riskProjects = projects.filter(p => p.riskFlag);

    const alerts = [];
    riskProjects.forEach((project) => {
        const factors = project.riskFactors || [];
        factors.forEach((factor, i) => {
            const spentPct = project.totalBudget > 0 ? Math.round((project.amountSpent / project.totalBudget) * 100) : 0;
            let reason = '';
            if (factor === 'BUDGET_OVERRUN') reason = `Spent ${spentPct}% budget but only ${project.completionPercentage}% complete`;
            else if (factor === 'TIMELINE_DELAY') reason = `Project delayed past expected end date`;
            else if (factor === 'BUDGET_SPIKE') reason = `Budget increased without justification`;
            else if (factor === 'GPS_FRAUD') reason = `GPS verification failed`;
            else if (factor === 'PUBLIC_CONCERN') reason = `Multiple citizen complaints received`;
            else reason = factor;

            alerts.push({
                id: `${project._id}-${i}`,
                project: project.title,
                reason,
                severity: factor === 'BUDGET_OVERRUN' || factor === 'GPS_FRAUD' || factor === 'BUDGET_SPIKE' ? 'High' : 'Medium',
                type: factor,
                time: project.updatedAt || project.createdAt,
            });
        });
    });

    const getSeverityStyle = (severity) => {
        if (severity === 'High') return { bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' };
        return { bg: '#FFFBEB', border: '#FDE68A', color: '#92400E' };
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12, borderLeft: '4px solid #EF4444' }}>
            <div className="card-header bg-white py-3 px-4 d-flex align-items-center justify-content-between" style={{ borderBottom: '1px solid #FEE2E2' }}>
                <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                    <IconAlertTriangle size={16} color="#EF4444" /> Risk Alerts <span className="badge bg-danger rounded-pill ms-2">{alerts.length}</span>
                </h6>
            </div>
            <div className="card-body p-0" style={{ maxHeight: 380, overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                    <div className="text-center py-5 text-muted" style={{ fontSize: 14 }}>No risk alerts</div>
                ) : (
                    alerts.map((alert) => {
                        const s = getSeverityStyle(alert.severity);
                        return (
                            <div key={alert.id} className="px-4 py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div className="fw-semibold mb-1" style={{ fontSize: 14 }}>{alert.project}</div>
                                        <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: 13, color: '#4B5563' }}>
                                            {alertIcons[alert.type] || <IconAlertTriangle size={14} />}
                                            <span>{alert.reason}</span>
                                        </div>
                                        <div className="d-flex gap-2 align-items-center">
                                            <span className="badge rounded-pill" style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 10 }}>
                                                {alert.severity} Priority
                                            </span>
                                            <small className="text-muted">{riskTypeLabels[alert.type] || alert.type}</small>
                                        </div>
                                    </div>
                                    <button className="btn btn-sm" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: 12, whiteSpace: 'nowrap', borderRadius: 6 }}>
                                        Investigate
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RiskAlertsPanel;
