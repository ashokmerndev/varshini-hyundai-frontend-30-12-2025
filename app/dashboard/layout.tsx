// 'use client';

// import Sidebar from '@/components/Sidebar';
// import Header from '@/components/Header';
// import PageTransition from '@/components/PageTransition';
// import { SocketProvider } from '@/components/providers/SocketProvider';
// import { motion } from 'framer-motion';

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <SocketProvider>
//       <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
//         {/* Animated Background Elements */}
//         <div className="fixed inset-0 overflow-hidden pointer-events-none">
//           <motion.div
//             animate={{
//               scale: [1, 1.2, 1],
//               rotate: [0, 90, 0],
//             }}
//             transition={{
//               duration: 20,
//               repeat: Infinity,
//               ease: 'linear',
//             }}
//             className="absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-blue-500/5 blur-3xl"
//           />
//           <motion.div
//             animate={{
//               scale: [1, 1.1, 1],
//               rotate: [0, -90, 0],
//             }}
//             transition={{
//               duration: 25,
//               repeat: Infinity,
//               ease: 'linear',
//             }}
//             className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-cyan-500/5 blur-3xl"
//           />
//         </div>

//         <Sidebar />
//         <Header />
        
//         <main className="ml-64 pt-16">
//           <div className="p-6">
//             <PageTransition>{children}</PageTransition>
//           </div>
//         </main>
//       </div>
//     </SocketProvider>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import { SocketProvider } from '@/components/providers/SocketProvider';
import { motion } from 'framer-motion';
import { AdminAuthService } from '@/lib/api'; // API Service Import

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // --- SECURITY CHECK ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Profile ని కాల్ చేసి టోకెన్ వాలిడ్ గా ఉందో లేదో చూస్తాం
        await AdminAuthService.getProfile();
        setIsAuthorized(true);
      } catch (error) {
        // టోకెన్ లేకపోయినా, ఎక్స్ పైర్ అయినా Login కి పంపిస్తాం
        console.error("Auth check failed:", error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // ఆథరైజ్ అయ్యే వరకు లోడింగ్ చూపించడం (Optional)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        
        {/* Animated Background Elements (z-index: 0) */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-blue-500/5 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-cyan-500/5 blur-3xl"
          />
        </div>

        {/* Layout Structure */}
        {/* Sidebar needs high z-index to stay above background */}
        <div className="relative z-30"> 
          <Sidebar />
        </div>

        {/* Header and Main Content */}
        <div className="relative z-20">
          <Header />
          <main className="ml-64 pt-16">
            <div className="p-6">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
        </div>

      </div>
    </SocketProvider>
  );
}