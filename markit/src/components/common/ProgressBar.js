import React from 'react';

const ProgressBar = ({ percentage, color = '#3B82F6', height = 8, showLabel = true }) => {
    const getColor = () => {
        if (color) return color;
        if (percentage >= 75) return '#10B981';
        if (percentage >= 50) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div>
            {showLabel && (
                <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">Progress</small>
                    <small className="fw-semibold" style={{ color: getColor() }}>{percentage}%</small>
                </div>
            )}
            <div className="progress" style={{ height, borderRadius: height / 2, backgroundColor: '#E5E7EB' }}>
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${percentage}%`, backgroundColor: getColor(), borderRadius: height / 2, transition: 'width 0.6s ease' }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
