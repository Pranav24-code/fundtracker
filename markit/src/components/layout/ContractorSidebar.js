import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconHome, IconBriefcase, IconLogOut } from '../common/Icons';

const navItems = [
    { label: 'Dashboard', path: '/contractor/dashboard', icon: <IconHome size={18} /> },
    { label: 'My Projects', path: '/contractor/projects', icon: <IconBriefcase size={18} /> },
];

const ContractorSidebar = () => {
    const router = useRouter();

    return (
        <div className="petms-sidebar bg-white shadow-sm" style={{ width: 260, minHeight: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 100, borderRight: '1px solid #e5e7eb' }}>
            <div className="p-4 text-center" style={{ borderBottom: '3px solid #EF4444' }}>
                <h4 className="mb-0 fw-bold" style={{ color: '#EF4444' }}>PETMS</h4>
                <small className="text-muted">Contractor Portal</small>
            </div>
            <nav className="mt-3">
                {navItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                        <a
                            className={`d-flex align-items-center px-4 py-3 text-decoration-none ${router.pathname === item.path ? 'fw-semibold' : 'text-dark'}`}
                            style={{
                                transition: 'all 0.2s',
                                borderLeft: router.pathname === item.path ? '4px solid #EF4444' : '4px solid transparent',
                                backgroundColor: router.pathname === item.path ? '#FEE2E2' : 'transparent',
                                color: router.pathname === item.path ? '#B91C1C' : undefined,
                            }}
                        >
                            <span className="me-3 d-flex">{item.icon}</span>
                            {item.label}
                        </a>
                    </Link>
                ))}
            </nav>
            <div className="position-absolute bottom-0 w-100 p-3" style={{ borderTop: '1px solid #e5e7eb' }}>
                <Link href="/">
                    <a className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
                        <IconLogOut size={14} /> Logout
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default ContractorSidebar;
