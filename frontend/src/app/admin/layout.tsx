'use client';

import AuthGuard from '@/components/common/AuthGuard';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="flex min-h-screen bg-surface-50">
        <AdminSidebar />
        <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
