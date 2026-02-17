'use client';

import AuthGuard from '@/components/common/AuthGuard';
import CitizenNavbar from '@/components/layout/CitizenNavbar';

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['citizen']}>
      <div className="min-h-screen bg-surface-50">
        <CitizenNavbar />
        <main className="pt-20 px-4 md:px-8 pb-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
