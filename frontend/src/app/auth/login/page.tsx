'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, clearError } from '@/redux/slices/authSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { toast } from 'react-toastify';
import Link from 'next/link';

const roles = ['admin', 'contractor', 'citizen'] as const;

export default function LoginPage() {
  const [role, setRole] = useState<string>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    try {
      const result = await dispatch(loginThunk({ email, password, role })).unwrap();
      toast.success('Login successful!');
      const userRole = result?.user?.role || role;
      router.push(`/${userRole}/dashboard`);
    } catch (err: any) {
      toast.error(err || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="absolute border border-white/10 rounded-full animate-pulse-soft"
              style={{ width: `${100 + i * 80}px`, height: `${100 + i * 80}px`, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </div>
        <div className="relative text-center px-12 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-white">P</span>
          </div>
          <h1 className="text-4xl font-heading font-bold mb-4 text-white">PETMS</h1>
          <p className="text-brand-200 text-lg">Public Expenditure Transparency<br />& Monitoring System</p>
          <p className="text-brand-300 mt-4 text-sm">Making government spending accountable</p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface-50">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden mb-8 text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">P</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">PETMS</h1>
          </div>

          <h2 className="text-2xl font-heading font-bold text-surface-900 mb-2">Welcome back</h2>
          <p className="text-surface-500 mb-8">Sign in to your account</p>

          {/* Role Selector */}
          <div className="flex gap-1 mb-8 p-1 bg-surface-100 rounded-xl">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  role === r
                    ? 'bg-white text-brand-600 shadow-soft'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={`${role}@petms.gov.in`}
                className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>

            {error && <p className="text-danger-500 text-sm bg-danger-50 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all hover:shadow-glow-brand flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-brand-600 hover:text-brand-700 font-medium">Register</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-brand-50 border border-brand-100 rounded-xl text-xs">
            <p className="text-brand-700 font-semibold mb-2">Demo Credentials:</p>
            <p className="text-brand-600/80">Admin: admin@petms.gov.in / Admin@123</p>
            <p className="text-brand-600/80">Contractor: contractor1@petms.gov.in / Contractor@123</p>
            <p className="text-brand-600/80">Citizen: citizen1@petms.gov.in / Citizen@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
