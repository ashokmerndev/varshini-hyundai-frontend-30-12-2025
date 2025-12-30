'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Tag,
  LogOut,
  AlertTriangle, // Added for the popup icon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminAuthService } from '@/lib/api';

interface AdminProfile {
  name: string;
  email: string;
  avatar?: string;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/products', icon: Package },
  { label: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Categories', href: '/dashboard/categories', icon: Tag },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  
  // New States for Logout Modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await AdminAuthService.getProfile();
        const rootResponse = response.data;
        const userData = rootResponse.data.data || rootResponse.data;
        setAdmin(userData);
      } catch (error) {
        console.error("Failed to load admin profile", error);
      }
    };
    fetchAdminData();
  }, []);

  // 1. Triggered when the small Logout icon is clicked
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // 2. Triggered when "Yes, Logout" is clicked in the modal
  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await AdminAuthService.logout();
      router.push('/admin/login');
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex h-16 items-center gap-3 border-b border-white/5 px-6"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Varshini Hyundai</h1>
              <p className="text-xs text-gray-400">Spares Admin</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white shadow-lg shadow-blue-500/10'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <Icon className="relative z-10 h-5 w-5" />
                      <span className="relative z-10">{item.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border-t border-white/5 p-4"
          >
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 backdrop-blur-sm group">
              {admin?.avatar ? (
                <img src={admin.avatar} alt={admin.name} className="h-10 w-10 rounded-full object-cover border border-white/10" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white shadow-lg">
                  {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">{admin?.name || 'Loading...'}</p>
                <p className="truncate text-xs text-gray-400" title={admin?.email}>{admin?.email || 'Please wait...'}</p>
              </div>

              {/* Logout Button (Triggers Modal) */}
              <button
                onClick={handleLogoutClick}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-red-500/10 p-3">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Confirm Logout</h3>
                <p className="mb-6 text-sm text-gray-400">
                  Are you sure you want to log out of your admin account?
                </p>

                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    disabled={isLoggingOut}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    disabled={isLoggingOut}
                    className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                     {isLoggingOut ? (
                        <>
                           <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                           <span>Logging out...</span>
                        </>
                     ) : (
                        "Yes, Logout"
                     )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}