import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../../components/seo';
import { useAuth } from '../../context/AuthContext';
import { IconShield, IconMail, IconLock, IconUsers, IconActivity, IconArrowRight } from '../../components/common/Icons';

const AdminLogin = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('admin@petms.gov.in');
    const [password, setPassword] = useState('Admin@123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await login(email, password, 'admin');
            if (result.success) {
                router.push('/admin/dashboard');
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
            <SEO pageTitle="Admin Login - PETMS" />
            <div className="d-flex min-vh-100 bg-white">
                {/* Left Side - Visual & Branding */}
                <div className="d-none d-lg-flex col-lg-6 position-relative align-items-center justify-content-center text-white"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1486406140526-aba18174386e?q=80&w=2070&auto=format&fit=crop")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 58, 138, 0.8) 100%)' }}></div>

                    <div className="position-relative z-index-1 px-5" style={{ maxWidth: 600 }}>
                        <div className="mb-4 d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-10 border border-white border-opacity-25" style={{ width: 64, height: 64 }}>
                            <IconShield size={32} color="#ffffff" />
                        </div>
                        <h1 className="fw-bold display-5 mb-3">Empowering Governance,<br />Connecting Communities</h1>
                        <p className="lead opacity-75 mb-5 fw-light">
                            The PETMS Administrative Portal ensures transparency, accountability, and seamless collaboration between the government, contractors, and citizens.
                        </p>

                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                                <div className="p-2 rounded-circle bg-white text-primary d-flex"><IconActivity size={20} /></div>
                                <div>
                                    <div className="fw-bold">Real-time Monitoring</div>
                                    <div className="small opacity-75">Track project progress and fund utilization instantly.</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                                <div className="p-2 rounded-circle bg-white text-primary d-flex"><IconUsers size={20} /></div>
                                <div>
                                    <div className="fw-bold">Citizen Engagement</div>
                                    <div className="small opacity-75">Direct feedback loop from the community you serve.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="position-absolute bottom-0 start-0 w-100 p-4 text-center small opacity-50">
                        Official Government Portal • Restricted Access
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-white">
                    <div className="w-100 p-5" style={{ maxWidth: 500 }}>
                        <div className="text-center mb-5">
                            <h2 className="fw-bold text-dark">Administrative Login</h2>
                            <p className="text-muted">Secure access for government officials</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger d-flex align-items-center gap-2 p-3 mb-4 rounded-3" style={{ fontSize: 13 }}>
                                <i className="bi bi-shield-exclamation text-danger"></i> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small text-uppercase">Official Email</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0 text-muted"><IconMail size={18} /></span>
                                    <input
                                        type="email"
                                        className="form-control bg-light border-start-0 py-3"
                                        placeholder="officer@petms.gov.in"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ boxShadow: 'none' }}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small text-uppercase">Secure Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0 text-muted"><IconLock size={18} /></span>
                                    <input
                                        type="password"
                                        className="form-control bg-light border-start-0 py-3"
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
                                    <input className="form-check-input" type="checkbox" id="rememberMe" />
                                    <label className="form-check-label text-muted small" htmlFor="rememberMe">Remember device</label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                disabled={loading}
                                style={{ background: '#0F172A', borderColor: '#0F172A' }}>
                                {loading ? 'Verifying Credentials...' : <>Access Dashboard <IconArrowRight size={18} /></>}
                            </button>
                        </form>

                        <div className="mt-5 pt-4 text-center border-top">
                            <div className="p-3 rounded-3 bg-light text-start mb-3">
                                <small className="d-block text-uppercase fw-bold text-muted mb-1" style={{ fontSize: 10 }}>Demo Credentials</small>
                                <div className="d-flex justify-content-between align-items-center small">
                                    <span className="text-dark fw-medium">admin@petms.gov.in</span>
                                    <span className="font-monospace text-secondary">Admin@123</span>
                                </div>
                            </div>
                            <div className="mt-3">
                                <Link href="/"><a className="text-muted small text-decoration-none">← Back to Home</a></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;
