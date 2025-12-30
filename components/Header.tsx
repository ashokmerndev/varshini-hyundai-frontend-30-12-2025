'use client';

import { motion } from 'framer-motion';
import { Bell, Search, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [notificationCount, setNotificationCount] = useState(3);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-black/40 px-6 backdrop-blur-xl"
      style={{ left: '16rem' }} // 64 = 16rem (sidebar width)
    >
      {/* Search Bar */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            placeholder="Search products, orders, customers..."
            className="w-full rounded-xl border border-white/5 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative rounded-xl bg-white/5 p-2.5 text-gray-400 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
            >
              {notificationCount}
            </motion.span>
          )}
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-xl bg-white/5 p-2.5 text-gray-400 backdrop-blur-sm transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.header>
  );
}
