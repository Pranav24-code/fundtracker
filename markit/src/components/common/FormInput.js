import React from 'react';

const FormInput = ({ label, type = 'text', placeholder, icon, value, onChange, error, name }) => {
    return (
        <div className="mb-3">
            {label && <label className="form-label fw-medium" style={{ fontSize: 14 }}>{label}</label>}
            <div className="input-group">
                {icon && (
                    <span className="input-group-text bg-white" style={{ borderColor: error ? '#EF4444' : '#D1D5DB' }}>
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    name={name}
                    style={{ borderColor: error ? '#EF4444' : '#D1D5DB', padding: '10px 14px' }}
                />
            </div>
            {error && <div className="text-danger mt-1" style={{ fontSize: 12 }}>{error}</div>}
        </div>
    );
};

export default FormInput;
