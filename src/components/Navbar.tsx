'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'ડૅશબોર્ડ', icon: '🏠' },
    { href: '/houses', label: 'મકાન સૂચિ', icon: '🏘️' },
    { href: '/admin', label: 'વ્યવસ્થાપન', icon: '⚙️' },
    { href: '/reports', label: 'અહેવાલ', icon: '📊' },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="bg-navy-900 text-white shadow-lg sticky top-0 z-50">
      {/* Top stripe */}
      <div className="h-1 bg-gradient-to-r from-saffron-500 via-yellow-400 to-saffron-500" />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-saffron-500 rounded-lg flex items-center justify-center group-hover:bg-saffron-400 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-sm leading-tight">જનગણના સર્વે</div>
              <div className="text-navy-200 text-xs">Census Survey System</div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-saffron-500 text-white'
                    : 'text-navy-200 hover:bg-navy-700 hover:text-white'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User & Signout */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <div className="text-navy-200 text-xs text-right">
                <div className="text-white font-medium">{user.email?.split('@')[0]}</div>
                <div>સર્વે અધિકારી</div>
              </div>
            )}
            <button
              id="signout-btn"
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-2 bg-navy-700 hover:bg-red-600 text-navy-200 hover:text-white rounded-lg text-sm transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>નીકળો</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-btn"
            className="md:hidden p-2 rounded-lg hover:bg-navy-700 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-800 border-t border-navy-700 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-saffron-500 text-white'
                    : 'text-navy-200 hover:bg-navy-700 hover:text-white'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="border-t border-navy-700 pt-3 mt-3">
              {user && (
                <div className="text-navy-300 text-xs px-4 mb-2">
                  {user.email} — સર્વે અધિકારી
                </div>
              )}
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-600 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>લૉગ આઉટ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
