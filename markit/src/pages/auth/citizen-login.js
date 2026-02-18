import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../../components/seo';
import { useAuth } from '../../context/AuthContext';
import { IconUser, IconMail, IconLock, IconHeart, IconEye, IconArrowRight } from '../../components/common/Icons';

const CitizenLogin = () => {
    const router = useRouter();
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            let result;
            if (isLogin) {
                result = await login(email, password, 'citizen');
            } else {
                result = await register({
                    name,
                    email,
                    password,
                    role: 'citizen'
                });
            }

            if (result.success) {
                router.push('/citizen/dashboard');
            } else {
                setError(result.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Connection failed. Is the backend server running?');
        }
        setLoading(false);
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setEmail('');
        setPassword('');
        setName('');
    };

    return (
        <>
            <SEO pageTitle={`Citizen ${isLogin ? 'Login' : 'Sign Up'} - PETMS`} />
            <div className="d-flex min-vh-100 bg-white">
                {/* Left Side - Visual & Branding */}
                <div className="d-none d-lg-flex col-lg-6 position-relative align-items-center justify-content-center text-white"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070&auto=format&fit=crop")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.9) 0%, rgba(16, 185, 129, 0.8) 100%)' }}></div>

                    <div className="position-relative z-index-1 px-5" style={{ maxWidth: 600 }}>
                        <div className="mb-4 d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-10 border border-white border-opacity-25" style={{ width: 64, height: 64 }}>
                            <IconUser size={32} color="#ffffff" />
                        </div>
                        <h1 className="fw-bold display-5 mb-3">Your Voice,<br />Your Community</h1>
                        <p className="lead opacity-75 mb-5 fw-light">
                            Join thousands of active citizens monitoring public projects and ensuring transparency in your neighborhood.
                        </p>

                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                                <div className="p-2 rounded-circle bg-white text-success d-flex"><IconEye size={20} /></div>
                                <div>
                                    <div className="fw-bold">Monitor Projects</div>
                                    <div className="small opacity-75">See where public funds are being spent near you.</div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                                <div className="p-2 rounded-circle bg-white text-success d-flex"><IconHeart size={20} /></div>
                                <div>
                                    <div className="fw-bold">Raise Concerns</div>
                                    <div className="small opacity-75">Report issues directly to authorities and track resolution.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="position-absolute bottom-0 start-0 w-100 p-4 text-center small opacity-50">
                        Empowering Citizens • Strengthening Democracy
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-white">
                    <div className="w-100 p-5" style={{ maxWidth: 500 }}>
                        <div className="text-center mb-5">
                            <h2 className="fw-bold text-dark">Citizen Portal</h2>
                            <p className="text-muted">{isLogin ? 'Welcome back, Neighbor!' : 'Join the Community'}</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger d-flex align-items-center gap-2 p-3 mb-4 rounded-3" style={{ fontSize: 13 }}>
                                <i className="bi bi-exclamation-circle text-danger"></i> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-secondary small text-uppercase">Full Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0 text-muted"><IconUser size={18} /></span>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-start-0 py-3"
                                            placeholder="Your Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required={!isLogin}
                                            style={{ boxShadow: 'none' }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small text-uppercase">Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0 text-muted"><IconMail size={18} /></span>
                                    <input
                                        type="email"
                                        className="form-control bg-light border-start-0 py-3"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ boxShadow: 'none' }}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small text-uppercase">Password</label>
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

                            {isLogin && (
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                                        <label className="form-check-label text-muted small" htmlFor="rememberMe">Remember me</label>
                                    </div>
                                    <a href="#" className="text-success small text-decoration-none fw-semibold">Forgot Password?</a>
                                </div>
                            )}

                            <button type="submit" className="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                disabled={loading}
                                style={{ background: '#059669', borderColor: '#059669' }}>
                                {loading ? 'Processing...' : <>{isLogin ? 'Sign In' : 'Create Account'} <IconArrowRight size={18} /></>}
                            </button>
                        </form>

                        <div className="mt-5 pt-4 text-center border-top">
                            <p className="text-muted small mb-0">
                                {isLogin ? 'New to PETMS?' : 'Already have an account?'}
                                <button onClick={toggleMode} className="btn btn-link text-success fw-semibold text-decoration-none p-0 ms-1">
                                    {isLogin ? 'Create an Account' : 'Sign In'}
                                </button>
                            </p>
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

export default CitizenLogin;
