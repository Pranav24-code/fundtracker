import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CitizenNavbar = () => {
    const router = useRouter();

    const navItems = [
        { label: 'Dashboard', path: '/citizen/dashboard' },
        { label: 'My Complaints', path: '/citizen/complaints' },
    ];

    return (
        <nav className="navbar navbar-expand-lg shadow-sm" style={{ backgroundColor: '#fff', borderBottom: '3px solid #10B981' }}>
            <div className="container">
                <Link href="/citizen/dashboard">
                    <a className="navbar-brand fw-bold" style={{ color: '#10B981' }}>
                        PETMS <small className="text-muted fw-normal" style={{ fontSize: 12 }}>Citizen Portal</small>
                    </a>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#citizenNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="citizenNav">
                    <ul className="navbar-nav ms-auto">
                        {navItems.map((item) => (
                            <li className="nav-item" key={item.path}>
                                <Link href={item.path}>
                                    <a className={`nav-link px-3 ${router.pathname === item.path ? 'fw-bold' : ''}`}
                                        style={{ color: router.pathname === item.path ? '#10B981' : '#374151' }}>
                                        {item.label}
                                    </a>
                                </Link>
                            </li>
                        ))}
                        <li className="nav-item ms-2">
                            <Link href="/">
                                <a className="btn btn-sm" style={{ backgroundColor: '#10B981', color: '#fff' }}>Logout</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default CitizenNavbar;
