import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../../components/seo';
import { useAuth } from '../../context/AuthContext';
import { IconHardHat, IconMail, IconLock } from '../../components/common/Icons';

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
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FBBF24 100%)' }}>
                <div className="card border-0 shadow-lg" style={{ width: 420, borderRadius: 16, borderTop: '4px solid #F59E0B' }}>
                    <div className="card-body p-5">
                        <div className="text-center mb-4">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                style={{ width: 64, height: 64, backgroundColor: '#FEF3C7' }}>
                                <IconHardHat size={28} color="#F59E0B" />
                            </div>
                            <h4 className="fw-bold" style={{ color: '#B45309' }}>Contractor Login</h4>
                            <p className="text-muted" style={{ fontSize: 14 }}>Access your project dashboard</p>
                        </div>

                        {error && <div className="alert alert-danger py-2" style={{ fontSize: 13 }}>{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-medium" style={{ fontSize: 13 }}>
                                    <span className="d-flex align-items-center gap-1"><IconMail size={14} color="#6B7280" /> Email</span>
                                </label>
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ borderRadius: 8, padding: '10px 14px' }} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-medium" style={{ fontSize: 13 }}>
                                    <span className="d-flex align-items-center gap-1"><IconLock size={14} color="#6B7280" /> Password</span>
                                </label>
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ borderRadius: 8, padding: '10px 14px' }} />
                            </div>
                            <button type="submit" className="btn text-white w-100 py-2 fw-semibold" style={{ backgroundColor: '#F59E0B', borderRadius: 10 }} disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-3 p-3 rounded" style={{ backgroundColor: '#FFFBEB', fontSize: 12 }}>
                            <div className="fw-semibold mb-1" style={{ color: '#B45309' }}>Demo Credentials</div>
                            <div>Email: contractor1@petms.gov.in</div>
                            <div>Password: Contractor@123</div>
                        </div>

                        <div className="text-center mt-3">
                            <Link href="/"><a className="text-muted" style={{ fontSize: 13 }}>← Back to Home</a></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContractorLogin;
