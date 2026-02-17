import React from 'react';

const Badge = ({ text, variant = 'primary' }) => {
    const variants = {
        primary: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning text-dark',
        danger: 'bg-danger',
        secondary: 'bg-secondary',
        info: 'bg-info text-dark',
    };

    return (
        <span className={`badge ${variants[variant] || variants.primary} rounded-pill`} style={{ fontSize: 11, fontWeight: 500, padding: '4px 10px' }}>
            {text}
        </span>
    );
};

export default Badge;
