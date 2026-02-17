import React from 'react';

const StatsCard = ({ icon, label, value, subtext, color, progress }) => {
    const colorMap = {
        blue: { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563EB', icon: '#3B82F6' },
        green: { bg: 'rgba(16, 185, 129, 0.1)', text: '#059669', icon: '#10B981' },
        orange: { bg: 'rgba(245, 158, 11, 0.1)', text: '#D97706', icon: '#F59E0B' },
        red: { bg: 'rgba(239, 68, 68, 0.1)', text: '#DC2626', icon: '#EF4444' },
        purple: { bg: 'rgba(139, 92, 246, 0.1)', text: '#7C3AED', icon: '#8B5CF6' },
    };

    const c = colorMap[color] || colorMap.blue;

    return (
        <div className="card border-0 h-100" style={{ 
            borderRadius: 16, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            background: '#fff',
            transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center justify-content-center rounded-3"
                        style={{ width: 48, height: 48, backgroundColor: c.bg, color: c.icon }}>
                        {icon}
                    </div>
                    {progress !== undefined && (
                         <span className="badge rounded-pill" style={{ backgroundColor: c.bg, color: c.text }}>
                             {progress}%
                         </span>
                    )}
                </div>
                
                <div>
                     <p className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: 11, letterSpacing: '0.5px' }}>{label}</p>
                     <h3 className="fw-bold mb-1" style={{ color: '#1F2937' }}>{value}</h3>
                     {subtext && <small className="text-muted" style={{ fontSize: 13 }}>{subtext}</small>}
                </div>

                {progress !== undefined && (
                    <div className="mt-3">
                        <div className="progress" style={{ height: 6, borderRadius: 10, backgroundColor: '#F3F4F6' }}>
                            <div className="progress-bar" role="progressbar" style={{ width: `${progress}%`, backgroundColor: c.icon, borderRadius: 10 }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
