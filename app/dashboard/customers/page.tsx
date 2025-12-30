'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils';
import type { User } from '@/types';
import api from '@/lib/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      // Note: This endpoint would need to be added to your backend
      const response = await api.get('/users'); // or '/admin/customers'
      const data = response.data.data || response.data;
      setCustomers(Array.isArray(data) ? data : data.users || []);
    } catch (error: any) {
      console.error('Customers fetch error:', error);
      toast.error('Failed to fetch customers');
      
      // Mock data for demonstration
      setCustomers([
        {
          _id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          phone: '+91 9876543210',
          role: 'customer',
          isEmailVerified: true,
          addresses: [
            {
              _id: 'addr1',
              street: '123 MG Road',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001',
              phone: '+91 9876543210',
              isDefault: true,
            }
          ],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-12-20T15:45:00Z',
        },
        {
          _id: '2',
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          phone: '+91 9123456789',
          role: 'customer',
          isEmailVerified: true,
          addresses: [],
          createdAt: '2024-02-10T08:15:00Z',
          updatedAt: '2024-12-22T10:20:00Z',
        },
        {
          _id: '3',
          name: 'Amit Patel',
          email: 'amit.patel@example.com',
          phone: '+91 9988776655',
          role: 'customer',
          isEmailVerified: false,
          addresses: [
            {
              _id: 'addr2',
              street: '456 Park Street',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001',
              phone: '+91 9988776655',
              isDefault: true,
            }
          ],
          createdAt: '2024-03-05T14:20:00Z',
          updatedAt: '2024-12-25T09:10:00Z',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Customers</h1>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Customers</h1>
          <p className="mt-1 text-gray-400">
            Manage your customer database
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <p className="text-sm text-gray-400">Total Customers</p>
          <p className="mt-1 text-2xl font-bold text-white">{customers.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <p className="text-sm text-gray-400">Verified Emails</p>
          <p className="mt-1 text-2xl font-bold text-green-400">
            {customers.filter(c => c.isEmailVerified).length}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <p className="text-sm text-gray-400">With Addresses</p>
          <p className="mt-1 text-2xl font-bold text-blue-400">
            {customers.filter(c => c.addresses && c.addresses.length > 0).length}
          </p>
        </div>
      </motion.div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.map((customer, index) => (
                <motion.tr
                  key={customer._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white">
                        {customer.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{customer.name}</p>
                        <p className="text-xs text-gray-400">ID: {customer._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {customer.addresses && customer.addresses.length > 0 ? (
                      <div className="flex items-start gap-2 text-sm text-gray-300">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {customer.addresses[0].city}, {customer.addresses[0].state}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No address</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        customer.isEmailVerified
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}
                    >
                      {customer.isEmailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* No Results */}
      {filteredCustomers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <Search className="h-16 w-16 text-gray-600" />
          <p className="mt-4 text-lg font-medium text-gray-400">No customers found</p>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria
          </p>
        </motion.div>
      )}
    </div>
  );
}
