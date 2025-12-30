'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  PieChart as PieIcon,
  CreditCard,
  BarChart as BarIcon
} from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { StatsSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { DashboardService } from '@/lib/api';
import { toast } from 'sonner';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend, BarChart, Bar 
} from 'recharts';
import { formatCurrency, getOrderStatusColor } from '@/lib/utils';
import Link from 'next/link';

// --- Interfaces ---
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  lowStockProducts: number;
  pendingOrders: number;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  user: { name: string; email: string };
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

interface TopProduct {
  _id: string;
  name: string;
  totalSales: number;
  revenue: number;
  images: Array<{ url: string }>;
}

//  - Data Structure
interface CategorySale {
  _id: string; // Category Name
  totalSales: number;
  revenue: number;
}

//  - Data Structure
interface PaymentStat {
  _id: string; // Payment Method (COD/Razorpay)
  count: number;
  amount: number;
}

//  - Data Structure
interface CustomerGrowth {
  month: string;
  count: number;
}

// Chart Colors
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export default function DashboardPage() {
  // State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<MonthlyRevenue[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  
  // New States for additional APIs
  const [categorySales, setCategorySales] = useState<CategorySale[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStat[]>([]);
  const [customerGrowth, setCustomerGrowth] = useState<CustomerGrowth[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetching ALL dashboard APIs in parallel
      const [
        statsRes, 
        revenueRes, 
        ordersRes, 
        productsRes,
        categoryRes,
        paymentRes,
        growthRes
      ] = await Promise.all([
        DashboardService.getStats(),
        DashboardService.getMonthlyRevenue(),
        DashboardService.getRecentOrders(5),
        DashboardService.getTopSellingProducts(5),
        // Assuming these methods exist in your DashboardService based on endpoints
        DashboardService.getSalesByCategory(), 
        DashboardService.getPaymentMethodStats(),
        DashboardService.getCustomerGrowth(6)
      ]);

      // --- Safe Data Setting ---
      setStats(statsRes.data.data?.stats || statsRes.data?.stats || {});
      setRevenueData(Array.isArray(revenueRes.data.data) ? revenueRes.data.data : []);
      setRecentOrders(Array.isArray(ordersRes.data.data) ? ordersRes.data.data : []);
      setTopProducts(Array.isArray(productsRes.data.data) ? productsRes.data.data : []);
      
      // Setting new visualization data
      setCategorySales(Array.isArray(categoryRes.data.data) ? categoryRes.data.data : []);
      setPaymentStats(Array.isArray(paymentRes.data.data) ? paymentRes.data.data : []);
      setCustomerGrowth(Array.isArray(growthRes.data.data) ? growthRes.data.data : []);

    } catch (error: any) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to fetch some dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between"><h1 className="text-3xl font-bold text-white">Dashboard</h1></div>
        <StatsSkeleton />
        <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-80" /><Skeleton className="h-80" /></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-gray-400">Overview of your store performance</p>
        </div>
        <button onClick={fetchDashboardData} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors">
          Refresh Data
        </button>
      </motion.div>

      {/* 1. Key Stats Cards (GET /stats) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Revenue" value={stats?.totalRevenue || 0} prefix="₹" icon={DollarSign} iconColor="text-green-400" iconBg="bg-green-500/10" trend={{ value: stats?.revenueGrowth || 0, isPositive: (stats?.revenueGrowth || 0) > 0 }} delay={0} />
        <StatsCard title="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingCart} iconColor="text-blue-400" iconBg="bg-blue-500/10" trend={{ value: stats?.ordersGrowth || 0, isPositive: (stats?.ordersGrowth || 0) > 0 }} delay={0.1} />
        <StatsCard title="Total Products" value={stats?.totalProducts || 0} icon={Package} iconColor="text-purple-400" iconBg="bg-purple-500/10" delay={0.2} />
        <StatsCard title="Total Customers" value={stats?.totalCustomers || 0} icon={Users} iconColor="text-cyan-400" iconBg="bg-cyan-500/10" delay={0.3} />
      </div>

      {/* 2. Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Revenue Chart (GET /revenue/monthly) - Takes 2 cols */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Revenue Analytics</h3>
              <p className="text-sm text-gray-400">Monthly revenue trends</p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg"><TrendingUp className="h-5 w-5 text-green-400"/></div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} formatter={(val: any) => [formatCurrency(val), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Customer Growth (GET /customers/growth) - Takes 1 col */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Customer Growth</h3>
              <p className="text-sm text-gray-400">New customers per month</p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="h-5 w-5 text-blue-400"/></div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 3. Secondary Stats Row (Pie Charts) */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Sales By Category (GET /sales/by-category) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Sales by Category</h3>
            <PieIcon className="h-5 w-5 text-purple-400"/>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            {categorySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categorySales} dataKey="revenue" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                    {categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }} formatter={(val: any) => formatCurrency(val)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-500">No category data available</p>}
          </div>
        </motion.div>

        {/* Payment Methods (GET /payments/methods) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
            <CreditCard className="h-5 w-5 text-yellow-400"/>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            {paymentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentStats} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5}>
                    {paymentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry._id === 'COD' ? '#f59e0b' : '#10b981'} stroke="rgba(0,0,0,0.5)" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-500">No payment data available</p>}
          </div>
        </motion.div>
      </div>

      {/* 4. Recent Orders & Top Products */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Recent Orders (GET /orders/recent) - 2 Cols */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-sm text-blue-400 hover:underline flex items-center gap-1">View All <ArrowRight className="h-4 w-4"/></Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{formatCurrency(order.totalAmount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getOrderStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
                  </div>
                </div>
              ))
            ) : <p className="text-gray-500 text-center py-4">No recent orders</p>}
          </div>
        </motion.div>

        {/* Top Products (GET /products/top-selling) - 1 Col */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Top Selling</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product._id} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-blue-400">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.totalSales} units sold</p>
                </div>
                <div className="text-sm font-semibold text-green-400">
                  {formatCurrency(product.revenue)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 5. Actionable Alerts (Uses stats data) */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/dashboard/products?filter=low-stock">
          <motion.div whileHover={{ scale: 1.01 }} className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 flex items-center gap-4 cursor-pointer">
            <div className="p-3 bg-yellow-500/10 rounded-xl"><AlertCircle className="h-6 w-6 text-yellow-400"/></div>
            <div>
              <h4 className="text-white font-medium">Low Stock Alert</h4>
              <p className="text-sm text-gray-400">{stats?.lowStockProducts || 0} products need restocking</p>
            </div>
          </motion.div>
        </Link>
        
        <Link href="/dashboard/orders?status=Placed">
          <motion.div whileHover={{ scale: 1.01 }} className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-center gap-4 cursor-pointer">
            <div className="p-3 bg-blue-500/10 rounded-xl"><Package className="h-6 w-6 text-blue-400"/></div>
            <div>
              <h4 className="text-white font-medium">Pending Orders</h4>
              <p className="text-sm text-gray-400">{stats?.pendingOrders || 0} orders to process</p>
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}