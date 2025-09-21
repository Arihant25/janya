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
    }
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
              className="text-2xl"
              style={{
                fontWeight: 900,
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
                className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200 bgtransparent hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, var(--md-sys-color-secondary), var(--md-sys-color-primary))' }}>
                  <span className="flex items-center justify-center w-full h-full text-white text-xs font-semibold shadow-sm">{getInitials(user.name)}</span>
                </div>

                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.name?.split(' ')[0] || 'User'}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-100 ${isDropdownOpen ? 'rotate-180' : ''}`}
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br" style={{ background: 'linear-gradient(135deg, var(--md-sys-color-secondary), var(--md-sys-color-primary))' }}>
                        <span className="flex items-center justify-center w-full h-full text-white text-sm font-semibold">{getInitials(user.name)}</span>
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
        <div className="px-2 py-1 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex flex-col items-center justify-center p-1 flex-1 rounded-xl transition-all duration-200 hover:bg-gray-50"
                  title={item.description}
                >
                  {/* Icon container with enhanced styling */}
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl mb-1 transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-br shadow-lg scale-105'
                    : 'bg-transparent group-hover:bg-gray-100 group-hover:scale-105'
                    }`} style={isActive ? { background: 'linear-gradient(135deg, var(--md-sys-color-secondary), var(--md-sys-color-primary))', boxShadow: '0 2px 16px 0 var(--md-sys-color-secondary, #8882)', } : {}}>
                    <div className={`transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}`}>
                      {item.icon}
                    </div>
                  </div>
                  
                  <span className={`text-xs font-medium transition-all duration-200 ${isActive
                    ? 'font-semibold'
                    : 'text-gray-600 group-hover:text-gray-800'
                    }`} style={isActive ? { color: 'var(--md-sys-color-secondary)' } : {}}>
                    {item.label}
                  </span>

                  {/* Ripple effect on tap */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden p-1">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-active:opacity-10 transition-opacity duration-150 rounded-xl" style={{ background: 'linear-gradient(90deg, var(--md-sys-color-secondary), var(--md-sys-color-primary))' }}></div>
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
      <div className="h-16"></div>
    </>
  );
}