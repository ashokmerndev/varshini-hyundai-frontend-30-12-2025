'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  CreditCard,
} from 'lucide-react';
import { DashboardService } from '@/lib/api';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils';
import type {
  RevenueData,
  CategorySales,
  PaymentMethodStats,
} from '@/types';

const COLORS = ['#2196F3', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState<RevenueData[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<RevenueData[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodStats[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedYear, selectedMonth]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      const [monthlyRes, dailyRes, categoryRes, paymentRes] = await Promise.all([
        DashboardService.getMonthlyRevenue({ year: selectedYear }),
        DashboardService.getDailyRevenue({ month: selectedMonth, year: selectedYear }),
        DashboardService.getSalesByCategory(),
        DashboardService.getPaymentMethods(),
      ]);

      setMonthlyRevenue(monthlyRes.data.data || monthlyRes.data || []);
      setDailyRevenue(dailyRes.data.data || dailyRes.data || []);
      setCategorySales(categoryRes.data.data || categoryRes.data || []);
      setPaymentMethods(paymentRes.data.data || paymentRes.data || []);
    } catch (error: any) {
      console.error('Analytics fetch error:', error);
      toast.error('Failed to fetch analytics data');
      
      // Mock data for demonstration
      setMonthlyRevenue([
        { month: 'Jan', revenue: 345000, orders: 145 },
        { month: 'Feb', revenue: 398000, orders: 167 },
        { month: 'Mar', revenue: 425000, orders: 189 },
        { month: 'Apr', revenue: 389000, orders: 172 },
        { month: 'May', revenue: 456000, orders: 198 },
        { month: 'Jun', revenue: 502000, orders: 215 },
        { month: 'Jul', revenue: 478000, orders: 203 },
        { month: 'Aug', revenue: 521000, orders: 224 },
        { month: 'Sep', revenue: 496000, orders: 210 },
        { month: 'Oct', revenue: 542000, orders: 231 },
        { month: 'Nov', revenue: 518000, orders: 219 },
        { month: 'Dec', revenue: 567000, orders: 241 },
      ]);

      setCategorySales([
        { _id: '1', category: 'Engine', totalSales: 234, revenue: 876000, productCount: 45 },
        { _id: '2', category: 'Brake', totalSales: 189, revenue: 523000, productCount: 32 },
        { _id: '3', category: 'Electrical', totalSales: 156, revenue: 412000, productCount: 28 },
        { _id: '4', category: 'Body', totalSales: 123, revenue: 345000, productCount: 21 },
        { _id: '5', category: 'Accessories', totalSales: 201, revenue: 289000, productCount: 56 },
      ]);

      setPaymentMethods([
        { method: 'Razorpay', count: 1234, totalAmount: 3456000, percentage: 65 },
        { method: 'COD', count: 654, totalAmount: 1876000, percentage: 35 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = monthlyRevenue.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="mt-1 text-gray-400">
            Detailed insights and performance metrics
          </p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-sm focus:border-blue-500/50 focus:outline-none"
          >
            {[2024, 2023, 2022].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Avg Order Value', value: formatCurrency(avgOrderValue), icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Categories', value: categorySales.length.toString(), icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">{kpi.label}</p>
                <p className="mt-2 text-2xl font-bold text-white">{kpi.value}</p>
              </div>
              <div className={`rounded-xl p-3 ${kpi.bg}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm"
      >
        <h3 className="mb-6 text-xl font-semibold text-white">Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2196F3" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2196F3" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2196F3"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenue (₹)"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOrders)"
              name="Orders"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category Sales & Payment Methods */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Sales */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm"
        >
          <h3 className="mb-6 text-xl font-semibold text-white">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="category" stroke="#9ca3af" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Bar dataKey="revenue" fill="#2196F3" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm"
        >
          <h3 className="mb-6 text-xl font-semibold text-white">Payment Methods Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ method, percentage }) => `${method}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="totalAmount"
              >
                {paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category Details Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white">Category Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Products
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total Sales
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Revenue
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Avg per Product
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categorySales.map((category, index) => (
                <motion.tr
                  key={category._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{category.category}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{category.productCount}</td>
                  <td className="px-6 py-4 text-gray-300">{category.totalSales}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-400">
                      {formatCurrency(category.revenue)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {formatCurrency(category.revenue / category.productCount)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
