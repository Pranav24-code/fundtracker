'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk, clearError } from '@/redux/slices/authSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('citizen');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const result = await dispatch(registerThunk({ name, email, password, role, phone, district, organization })).unwrap();
      toast.success('Registration successful!');
      router.push(`/${result?.user?.role || role}/dashboard`);
    } catch (err: any) {
      toast.error(err || 'Registration failed');
    }
  };

  const passwordStrength = () => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const strength = passwordStrength();
  const strengthColors = ['bg-danger-500', 'bg-danger-500', 'bg-warning-500', 'bg-success-500', 'bg-success-400'];

  const inputClass = "w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="w-full max-w-lg relative animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg font-bold">P</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">Create Account</h1>
          <p className="text-surface-500 text-sm mt-1">Join PETMS to monitor public spending</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-surface-200">
              <div className={`h-full rounded-full transition-all duration-500 ${step >= s ? 'bg-brand-500 w-full' : 'w-0'}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-surface-400 mb-6 -mt-6">
          <span className={step >= 1 ? 'text-brand-600 font-medium' : ''}>Role</span>
          <span className={step >= 2 ? 'text-brand-600 font-medium' : ''}>Info</span>
          <span className={step >= 3 ? 'text-brand-600 font-medium' : ''}>Credentials</span>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200/60 shadow-card p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm font-medium text-surface-700 mb-4">Choose your role</p>
                <div className="grid grid-cols-2 gap-4">
                  {(['citizen', 'contractor'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-6 rounded-2xl border-2 text-center transition-all duration-200 hover:-translate-y-0.5 ${
                        role === r ? 'border-brand-500 bg-brand-50 shadow-glow-brand' : 'border-surface-200 bg-surface-50 hover:border-surface-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${role === r ? 'bg-brand-100' : 'bg-surface-100'}`}>
                        <span className="text-2xl">{r === 'citizen' ? '👤' : '🏗️'}</span>
                      </div>
                      <span className={`text-sm font-semibold capitalize ${role === r ? 'text-brand-700' : 'text-surface-600'}`}>{r}</span>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setStep(2)} className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl mt-4 transition-all hover:shadow-glow-brand">
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm font-medium text-surface-700 mb-4">Personal Information</p>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full Name" className={inputClass} />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className={inputClass} />
                <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="District" className={inputClass} />
                {role === 'contractor' && (
                  <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Organization Name" className={inputClass} />
                )}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-surface-200 text-surface-600 rounded-xl font-medium hover:bg-surface-50 transition-colors">Back</button>
                  <button type="button" onClick={() => setStep(3)} className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all hover:shadow-glow-brand">Continue</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm font-medium text-surface-700 mb-4">Account Credentials</p>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email Address" className={inputClass} />
                <div>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password (min 8 chars)" className={inputClass} />
                  {password && (
                    <div className="flex gap-1 mt-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < strength ? strengthColors[strength] : 'bg-surface-200'}`} />
                      ))}
                    </div>
                  )}
                </div>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm Password" className={inputClass} />
                {error && <p className="text-danger-500 text-sm bg-danger-50 px-3 py-2 rounded-lg">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border-2 border-surface-200 text-surface-600 rounded-xl font-medium hover:bg-surface-50 transition-colors">Back</button>
                  <button type="submit" disabled={loading} className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all hover:shadow-glow-brand flex items-center justify-center gap-2">
                    {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    Register
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-surface-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
