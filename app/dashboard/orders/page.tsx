'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Eye,
  Package,
  PackageCheck,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCcw,
  X,
  MapPin,
  Calendar,
  User as UserIcon,
  CreditCard,
  Clock // Added Clock icon for Date column
} from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { OrderService, downloadInvoice } from '@/lib/api';
import { toast } from 'sonner';
import { formatCurrency, getOrderStatusColor, cn } from '@/lib/utils';
import { useSocket } from '@/components/providers/SocketProvider';
import Image from 'next/image';

// --- Types ---
interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  product?: {
    images: string[];
  };
}

interface User {
  name: string;
  email: string;
  phone?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: User;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  paymentMethod: 'COD' | 'Razorpay';
  paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  orderStatus: 'Placed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

const ORDER_STATUSES = ['Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_ICONS: Record<string, any> = {
  Placed: Package,
  Packed: PackageCheck,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: XCircle,
};

// --- Components ---

// 1. Order Details Modal Component
const OrderDetailsModal = ({ 
  order, 
  onClose, 
  onStatusUpdate 
}: { 
  order: Order; 
  onClose: () => void; 
  onStatusUpdate: (id: string, status: string) => void;
}) => {
  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-[#1e1e1e] border border-white/10 shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Order Details</h2>
            <p className="text-sm text-cyan-400 font-mono mt-1">{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Customer & Date Info */}
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-3">
              <div className="mt-1 rounded-lg bg-blue-500/10 p-2 h-fit">
                <UserIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Customer</p>
                <p className="font-medium text-white text-lg">{order.user?.name || 'Guest User'}</p>
                <p className="text-sm text-gray-400">{order.user?.email}</p>
                {order.shippingAddress?.phone && (
                  <p className="text-sm text-gray-400">{order.shippingAddress.phone}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 rounded-lg bg-purple-500/10 p-2 h-fit">
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Order Date</p>
                <p className="font-medium text-white">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div>
            <p className="text-sm font-medium text-gray-400 mb-3">Items ({order.items.length})</p>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 rounded-xl bg-white/5 p-3 border border-white/5">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/10">
                    {item.image || item.product?.images?.[0] ? (
                      <img 
                        src={item.image || item.product?.images?.[0]} 
                        alt={item.name} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white line-clamp-1">{item.name}</p>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{formatCurrency(item.price * item.quantity)}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500">{formatCurrency(item.price)} each</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address & Payment Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Shipping Address</span>
              </div>
              <div className="rounded-xl bg-white/5 p-4 text-sm text-gray-300 border border-white/5 leading-relaxed">
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                <p>PIN: {order.shippingAddress?.pincode}</p>
              </div>
            </div>

            <div className="space-y-2">
               <div className="flex items-center gap-2 text-gray-400">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm font-medium">Payment Details</span>
              </div>
              <div className="rounded-xl bg-white/5 p-4 border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Method</span>
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    order.paymentMethod === 'COD' ? "bg-yellow-500/10 text-yellow-400" : "bg-blue-500/10 text-blue-400"
                  )}>{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Status</span>
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    order.paymentStatus === 'Completed' ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"
                  )}>{order.paymentStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex justify-end items-center pt-4 border-t border-white/10">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className="text-3xl font-bold text-white mt-1">{formatCurrency(order.totalAmount)}</p>
            </div>
          </div>

          {/* Update Status Section */}
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-gray-400">Update Order Status</label>
            <div className="relative">
              <select
                value={order.orderStatus}
                onChange={(e) => onStatusUpdate(order._id, e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all hover:bg-white/10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status} className="bg-[#1e1e1e] text-white">
                    {status}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <RefreshCcw className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main Page Component ---
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    fetchOrders();
  }, []);

  // Socket Listener
  useEffect(() => {
    if (socket && isConnected) {
      socket.on('order_status_updated', (data: any) => {
        setOrders((prev) => 
          prev.map((order) =>
            order._id === data.orderId
              ? { ...order, orderStatus: data.orderStatus }
              : order
          )
        );
        
        if (selectedOrder && selectedOrder._id === data.orderId) {
             setSelectedOrder(prev => prev ? { ...prev, orderStatus: data.orderStatus } : null);
        }
        
        if (data.type === 'new_order') fetchOrders();
        toast.info(`Order status updated to ${data.orderStatus}`);
      });
      return () => { socket.off('order_status_updated'); };
    }
  }, [socket, isConnected, selectedOrder]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await OrderService.getAllOrders({ limit: 100, page: 1 });
      const incomingData = response.data.data?.orders || response.data.data || response.data || [];
      if (Array.isArray(incomingData)) setOrders(incomingData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, orderStatus: newStatus as any } : o));
    if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus as any });
    }
    try {
      await OrderService.updateStatus(orderId, { orderStatus: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
      fetchOrders(); 
    }
  };

  const handleDownloadInvoice = async (order: Order) => {
    try {
      toast.loading('Downloading invoice...');
      const response = await downloadInvoice(order._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss();
      toast.success('Invoice downloaded');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to download invoice');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (order.orderNumber || '').toLowerCase().includes(query) ||
      (order.user?.name || '').toLowerCase().includes(query) ||
      (order.user?.email || '').toLowerCase().includes(query);
    const matchesStatus = selectedStatus === 'All' || order.orderStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return <div className="space-y-6"><h1 className="text-3xl font-bold text-white">Orders</h1><TableSkeleton /></div>;

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders Dashboard</h1>
          <p className="mt-1 text-gray-400">Manage orders and view details</p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center gap-2 rounded-lg border border-white/5 px-3 py-1.5 text-sm font-medium transition-colors',
              isConnected
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            )}
          >
            <div
              className={cn(
                'h-2 w-2 rounded-full animate-pulse',
                isConnected ? 'bg-green-400' : 'bg-red-400'
              )}
            />
            {isConnected ? 'Live' : 'Offline'}
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Order ID, Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 scrollbar-hide">
          {['All', ...ORDER_STATUSES].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all',
                selectedStatus === status ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {ORDER_STATUSES.map((status) => {
          const count = orders.filter((o) => o.orderStatus === status).length;
          const Icon = STATUS_ICONS[status] || Package;
          const isCancelled = status === 'Cancelled';
          
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-[#141414] p-4 transition-colors hover:bg-white/5"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("p-2 rounded-lg", isCancelled ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400")}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-400">{status}</span>
              </div>
              <p className="text-2xl font-bold text-white pl-1">{count}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">Order</th>
                {/* --- Added Date Column --- */}
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">Customer</th>
                {/* --- Added Payment Column --- */}
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No orders found</td></tr>
              ) : (
                filteredOrders.map((order) => {
                  const firstItem = order.items?.[0];
                  const itemImage = firstItem?.image || firstItem?.product?.images?.[0];
                  const totalItems = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

                  return (
                    <motion.tr key={order._id} whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }} className="group">
                      
                      {/* 1. Order ID + Image + Item Count (Stock Style) */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
                            {itemImage ? (
                              <Image 
                                src={itemImage} 
                                alt="Item" 
                                fill 
                                className="object-cover transition-transform group-hover:scale-110" 
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-500">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <code className="rounded bg-white/5 px-2 py-1 text-xs font-mono text-cyan-400">
                              {order.orderNumber}
                            </code>
                            <div className="mt-1">
                                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-300">
                                    {totalItems} Item{totalItems !== 1 ? 's' : ''}
                                </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Order Date Column (NEW) */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-white font-medium">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                      </td>

                      {/* 3. Customer */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{order.user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                      </td>

                      {/* 4. Payment Column (NEW) */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                            <span className={cn(
                                "inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                                order.paymentMethod === 'COD' 
                                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" 
                                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            )}>
                                {order.paymentMethod}
                            </span>
                            <span className={cn(
                                "text-xs font-medium",
                                order.paymentStatus === 'Completed' ? "text-green-400" :
                                order.paymentStatus === 'Failed' ? "text-red-400" : "text-gray-400"
                            )}>
                                {order.paymentStatus}
                            </span>
                        </div>
                      </td>

                      {/* 5. Amount */}
                      <td className="px-6 py-4 font-semibold text-white">{formatCurrency(order.totalAmount)}</td>
                      
                      {/* 6. Status */}
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                          getOrderStatusColor(order.orderStatus)
                        )}>
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* 7. Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-lg bg-blue-500/10 p-2 text-blue-400 transition-colors hover:bg-blue-500/20"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="rounded-lg bg-green-500/10 p-2 text-green-400 transition-colors hover:bg-green-500/20"
                            title="Download Invoice"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}