'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  HomeIcon,
  FolderIcon,
  ArrowUpIcon,
  BanknotesIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const navItems = [
  { href: '/contractor/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/contractor/projects', label: 'My Projects', icon: FolderIcon },
  { href: '/contractor/updates', label: 'Submit Update', icon: ArrowUpIcon },
  { href: '/contractor/tranches', label: 'Payment Tranches', icon: BanknotesIcon },
];

export default function ContractorSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-surface-200/60 flex flex-col transition-all duration-300 fixed h-full z-30 shadow-soft`}>
        <div className="p-4 flex items-center justify-between border-b border-surface-200/60">
          {!collapsed && (
            <Link href="/contractor/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <span className="text-xl font-heading font-bold text-surface-900">PETMS</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors">
            <Bars3Icon className="w-5 h-5 text-surface-400" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-accent-50 text-accent-600 shadow-soft'
                    : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-accent-500' : ''}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-200/60">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-accent-100 flex items-center justify-center text-accent-600 text-sm font-bold">
                {user?.name?.[0] || 'C'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-surface-800 truncate">{user?.name}</p>
                <p className="text-xs text-surface-400">Contractor</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-surface-500 hover:text-danger-600 hover:bg-danger-50 rounded-xl transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>
  );
}
