'use client';

import AuthGuard from '@/components/common/AuthGuard';
import ContractorSidebar from '@/components/layout/ContractorSidebar';

export default function ContractorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={['contractor']}>
      <div className="flex min-h-screen bg-surface-50">
        <ContractorSidebar />
        <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
