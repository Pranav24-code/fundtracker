import React from 'react';

const StatsCard = ({ icon, label, value, subtext, color, progress }) => {
    const colorMap = {
        blue: { bg: '#EFF6FF', border: '#3B82F6', text: '#1D4ED8' },
        green: { bg: '#ECFDF5', border: '#10B981', text: '#047857' },
        orange: { bg: '#FFF7ED', border: '#F59E0B', text: '#B45309' },
        red: { bg: '#FEF2F2', border: '#EF4444', text: '#B91C1C' },
        purple: { bg: '#F5F3FF', border: '#8B5CF6', text: '#6D28D9' },
    };

    const c = colorMap[color] || colorMap.blue;

    return (
        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: `4px solid ${c.border}`, borderRadius: 12 }}>
            <div className="card-body p-4">
                <div className="d-flex align-items-start justify-content-between">
                    <div>
                        <p className="text-muted mb-1" style={{ fontSize: 13, fontWeight: 500 }}>{label}</p>
                        <h3 className="fw-bold mb-1" style={{ color: c.text }}>{value}</h3>
                        {subtext && <small className="text-muted">{subtext}</small>}
                    </div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 48, height: 48, backgroundColor: c.bg, flexShrink: 0 }}>
                        {icon}
                    </div>
                </div>
                {progress !== undefined && (
                    <div className="mt-3">
                        <div className="progress" style={{ height: 6, borderRadius: 3 }}>
                            <div className="progress-bar" role="progressbar" style={{ width: `${progress}%`, backgroundColor: c.border, borderRadius: 3 }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
