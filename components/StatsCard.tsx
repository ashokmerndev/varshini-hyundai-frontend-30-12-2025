'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  delay = 0,
}: StatsCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const controls = animate(count, value, {
        duration: 2,
        delay,
        ease: 'easeOut',
      });

      return controls.stop;
    }
  }, [isVisible, value, count, delay]);

  useEffect(() => {
    return rounded.on('change', (latest) => {
      setDisplayValue(latest.toLocaleString('en-IN'));
    });
  }, [rounded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:shadow-2xl"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${iconColor}15, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <motion.div
              className="mt-2 flex items-baseline gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
            >
              <h3 className="text-3xl font-bold text-white">
                {prefix}
                {displayValue}
                {suffix}
              </h3>
              {trend && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.4 }}
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    trend.isPositive ? 'text-green-400' : 'text-red-400'
                  )}
                >
                  <svg
                    className={cn('h-4 w-4', !trend.isPositive && 'rotate-180')}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  {Math.abs(trend.value)}%
                </motion.span>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: delay + 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 10,
            }}
            className={cn('rounded-xl p-3', iconBg)}
          >
            <Icon className={cn('h-6 w-6', iconColor)} />
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: delay + 0.5, duration: 0.6 }}
          className={cn('mt-4 h-1 rounded-full', iconColor.replace('text-', 'bg-'))}
          style={{ transformOrigin: 'left' }}
        />
      </div>

      {/* Decorative corner accent */}
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}
