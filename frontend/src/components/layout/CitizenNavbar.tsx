'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  HomeIcon,
  FolderIcon,
  ExclamationTriangleIcon,
  MapIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const navLinks = [
  { href: '/citizen/dashboard', label: 'Home', icon: HomeIcon },
  { href: '/citizen/complaints', label: 'My Complaints', icon: ExclamationTriangleIcon },
  { href: '/citizen/map', label: 'Map', icon: MapIcon },
];

export default function CitizenNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-surface-200/60 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/citizen/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <span className="text-lg font-heading font-bold text-surface-900">PETMS</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active ? 'bg-brand-50 text-brand-700 shadow-soft' : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${active ? 'text-brand-600' : ''}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-bold">
                  {user?.name?.[0] || 'C'}
                </div>
                <span className="text-sm text-surface-700 font-medium">{user?.name}</span>
              </div>
              <button onClick={logout} className="hidden md:block p-2 text-surface-400 hover:text-danger-600 rounded-xl hover:bg-danger-50 transition-colors">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-surface-500">
                {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-surface-200/60 pb-4 px-4 bg-white">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-sm text-surface-600 hover:bg-surface-50 rounded-xl"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="flex items-center gap-3 px-3 py-3 text-sm text-danger-600 hover:bg-danger-50 rounded-xl w-full"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </nav>
  );
}
