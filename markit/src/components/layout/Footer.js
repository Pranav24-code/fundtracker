import React from 'react';

const Footer = () => {
    return (
        <footer className="py-4 mt-5" style={{ backgroundColor: '#1F2937', color: '#9CA3AF' }}>
            <div className="container text-center">
                <p className="mb-1" style={{ color: '#D1D5DB' }}>PETMS — Public Expenditure Transparency & Monitoring System</p>
                <p className="mb-0" style={{ fontSize: 13 }}>Built for transparent governance in India</p>
            </div>
        </footer>
    );
};

export default Footer;
