'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { BookOpen, Edit, Bot, Compass, User, LogOut, ChevronDown } from 'lucide-react';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  if (!user) return null;

  // Define navigation items with enhanced styling
  const navItems = [
    {
      href: '/journal',
      label: 'Write',
      icon: <Edit size={24} />,
      description: 'Create new entry'
    },
    {
      href: '/journals',
      label: 'Entries',
      icon: <BookOpen size={24} />,
      description: 'View all journals'
    },
    {
      href: '/chat',
      label: 'AI Chat',
      icon: <Bot size={24} />,
      description: 'Chat with AI'
    },
    {
      href: '/recommendations',
      label: 'Discover',
      icon: <Compass size={24} />,
      description: 'Find new content'
    },
  ];

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Enhanced Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center max-w-screen-xl mx-auto">
            {/* Logo with subtle animation */}
            <Link
              href="/journal"
              className="text-xl font-bold"
              style={{
                color: 'var(--janya-primary)',
              }}
            >
              Janya
            </Link>

            {/* Enhanced User Menu */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                  {getInitials(user.name)}
                </div>

                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.name?.split(' ')[0] || 'User'}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Enhanced Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200"
                >
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={16} className="text-gray-500" />
                      <span>Profile Settings</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content Spacing */}
      <div className="h-16"></div>

      {/* Enhanced Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
        <div className="px-2 py-1 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex flex-col items-center justify-center p-2 flex-1 rounded-xl transition-all duration-200 hover:bg-gray-50"
                  title={item.description}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                  )}

                  {/* Icon container with enhanced styling */}
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl mb-1 transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/25 scale-105'
                    : 'bg-transparent group-hover:bg-gray-100 group-hover:scale-105'
                    }`}>
                    <div className={`transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                      }`}>
                      {item.icon}
                    </div>

                    {/* Subtle glow effect for active state */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 opacity-20 blur-md"></div>
                    )}
                  </div>

                  {/* Label with enhanced typography */}
                  <span className={`text-xs font-medium transition-all duration-200 ${isActive
                    ? 'text-purple-600 font-semibold'
                    : 'text-gray-600 group-hover:text-gray-800'
                    }`}>
                    {item.label}
                  </span>

                  {/* Ripple effect on tap */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-active:opacity-10 transition-opacity duration-150 rounded-xl"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Safe area padding for iOS devices */}
        <div className="pb-safe"></div>
      </nav>

      {/* Bottom spacing for content */}
      <div className="h-20 sm:h-16"></div>
    </>
  );
}