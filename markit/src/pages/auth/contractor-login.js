import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../../components/seo';
import { useAuth } from '../../context/AuthContext';
import { IconHardHat, IconMail, IconLock, IconArrowRight, IconBuilding, IconMapPin } from '../../components/common/Icons';

const ContractorLogin = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('contractor1@petms.gov.in');
    const [password, setPassword] = useState('Contractor@123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await login(email, password, 'contractor');
            if (result.success) {
                router.push('/contractor/dashboard');
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Is the backend server running?');
        }
        setLoading(false);
    };

    return (
        <>
            <SEO pageTitle="Contractor Login - PETMS" />
            <div className="container-fluid min-vh-100 d-flex p-0">
                {/* Left Side - Visual */}
                <div className="col-lg-8 d-none d-lg-flex position-relative align-items-center justify-content-center overflow-hidden"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(185, 28, 28, 0.95)' }}></div>
                    <div className="position-relative z-index-1 text-white px-5 d-flex flex-column justify-content-center h-100" style={{ maxWidth: 800 }}>

                        <div className="mb-5">
                            <div className="border border-white border-opacity-25 rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: 64, height: 64 }}>
                                <IconBuilding size={32} />
                            </div>
                            <h1 className="display-4 fw-bold mb-3" style={{ letterSpacing: '-1px' }}>Building Trust,<br />Delivering Quality</h1>
                            <p className="lead w-75 opacity-75">Join the government's premier platform for infrastructure development. Experience transparent tendering and automated payments.</p>
                        </div>

                        <div className="d-flex flex-column gap-4">
                            <div className="d-flex gap-4 p-4 rounded-4 border border-white border-opacity-10" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                                <div className="mt-1 bg-white bg-opacity-20 p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                                    <IconHardHat size={24} />
                                </div>
                                <div>
                                    <h4 className="fw-bold mb-1">Manage Workflows</h4>
                                    <p className="mb-0 opacity-75 small">Digital submission of implementation plans and daily progress reports.</p>
                                </div>
                            </div>

                            <div className="d-flex gap-4 p-4 rounded-4 border border-white border-opacity-10" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                                <div className="mt-1 bg-white bg-opacity-20 p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                                    <IconMapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="fw-bold mb-1">Proof of Work</h4>
                                    <p className="mb-0 opacity-75 small">Geo-tagged evidence uploads for faster billing and milestone verification.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="col-lg-4 col-12 bg-white d-flex align-items-center justify-content-center position-relative">
                    <div className="w-100 p-5" style={{ maxWidth: 500 }}>
                        <div className="text-center mb-5">
                            <div className="d-inline-flex justify-content-center align-items-center rounded-circle bg-danger bg-opacity-10 mb-3" style={{ width: 80, height: 80 }}>
                                <IconBuilding size={40} color="#EF4444" />
                            </div>
                            <h2 className="fw-bold mb-1" style={{ color: '#991B1B' }}>Contractor Portal</h2>
                            <p className="text-muted">Partnering for Progress</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger d-flex align-items-center gap-2 p-3 mb-4 rounded-3 shadow-sm border-0" style={{ fontSize: 13, backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
                                <i className="bi bi-exclamation-triangle-fill"></i> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label fw-bold text-secondary small text-uppercase" style={{ fontSize: 11, letterSpacing: '1px' }}>Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0 text-muted ps-3 border"><IconMail size={18} /></span>
                                    <input
                                        type="email"
                                        className="form-control bg-light border-start-0 py-3 ps-2 border"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ boxShadow: 'none' }}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold text-secondary small text-uppercase" style={{ fontSize: 11, letterSpacing: '1px' }}>Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0 text-muted ps-3 border"><IconLock size={18} /></span>
                                    <input
                                        type="password"
                                        className="form-control bg-light border-start-0 py-3 ps-2 border"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ boxShadow: 'none' }}
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="rememberMe" style={{ borderColor: '#D1D5DB' }} />
                                    <label className="form-check-label text-muted small" htmlFor="rememberMe">Remember me</label>
                                </div>
                                <a href="#" className="text-danger small text-decoration-none fw-semibold">Forgot Password?</a>
                            </div>

                            <button type="submit" className="btn btn-danger w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 transform-scale-hover"
                                disabled={loading}
                                style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', border: 'none', transition: 'transform 0.2s' }}>
                                {loading ? 'Authenticating...' : <>Sign In <IconArrowRight size={18} /></>}
                            </button>
                        </form>

                        <div className="mt-5 text-center">
                            <div className="p-3 rounded-3 bg-light text-center mb-4 border border-light">
                                <small className="text-muted d-block uppercase tracking-wider mb-1" style={{ fontSize: 10 }}>Allowed Credentials</small>
                                <span className="d-block fw-bold text-dark small">contractor1@petms.gov.in</span>
                                <span className="d-block font-monospace text-secondary" style={{ fontSize: 11 }}>Contractor@123</span>
                            </div>

                            <p className="text-muted small mb-0">
                                Not registered yet? <Link href="/"><a className="text-danger fw-bold text-decoration-none">Contact Support</a></Link>
                            </p>
                            <div className="mt-3">
                                <Link href="/"><a className="text-secondary small text-decoration-none hover-opacity">← Back to Home</a></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContractorLogin;
