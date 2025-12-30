import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ============================================================================
// ADMIN AUTHENTICATION SERVICE
// ============================================================================
export const AdminAuthService = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/admin/auth/login', credentials),
  
  refreshToken: () =>
    api.post('/admin/auth/refresh-token'),
  
  getProfile: () =>
    api.get('/admin/auth/profile'),
  
  updateProfile: (data: any) =>
    api.put('/admin/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/admin/auth/change-password', data),
  
  logout: () =>
    api.post('/admin/auth/logout'),
};

// ============================================================================
// PRODUCT SERVICE
// ============================================================================
export const ProductService = {
  // Get all products with filters
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) => api.get('/products', { params }),
  
  // Get single product
  getById: (id: string) =>
    api.get(`/products/${id}`),
  
  // Get featured products
  getFeatured: () =>
    api.get('/products/featured'),
  
  // Get products by category
  getByCategory: (category: string) =>
    api.get(`/products/category/${category}`),
  
  // Create new product (Admin)
  create: (data: FormData) =>
    api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  // Update product (Admin)
  update: (id: string, data: FormData) =>
    api.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  // Update stock only (Admin)
  updateStock: (id: string, stock: number) =>
    api.patch(`/products/${id}/stock`, { stock }),
  
  // Delete product (Admin)
  delete: (id: string) =>
    api.delete(`/products/${id}`),
  
  // Delete product image (Admin)
  deleteImage: (productId: string, imageId: string) =>
    api.delete(`/products/${productId}/images/${imageId}`),
  
  // Get low stock products (Admin)
  getLowStock: () =>
    api.get('/products/low-stock'),
};

// ============================================================================
// ORDER SERVICE
// ============================================================================
export const OrderService = {
  // Get all orders (Admin)
  getAllOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) => api.get('/orders/admin/all', { params }),
  
  // Get single order
  getById: (id: string) =>
    api.get(`/orders/${id}`),
  
  // Update order status (Admin)
  updateStatus: (id: string, data: { 
    orderStatus: 'Placed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
    note?: string;
  }) => api.put(`/orders/${id}/status`, data),
  
  // Download invoice (Blob response)
  getInvoice: async (orderId: string): Promise<Blob> => {
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob',
    });
    return response.data;
  },
  
  // Cancel order
  cancelOrder: (id: string, reason?: string) =>
    api.put(`/orders/${id}/cancel`, { cancellationReason: reason }),
};

// ============================================================================
// PAYMENT SERVICE
// ============================================================================
export const PaymentService = {
  // Get all payments (Admin)
  getAllPayments: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => api.get('/payments/admin/all', { params }),
  
  // Get payment details
  getByOrderId: (orderId: string) =>
    api.get(`/payments/${orderId}`),
  
  // Get payment method statistics (Admin)
  getPaymentMethods: () =>
    api.get('/dashboard/payments/methods'),
};

// ============================================================================
// DASHBOARD SERVICE
// ============================================================================
export const DashboardService = {
  // Get dashboard statistics
  getStats: () =>
    api.get('/dashboard/stats'),
  
  // Get monthly revenue data
  getMonthlyRevenue: (params?: { year?: number }) =>
    api.get('/dashboard/revenue/monthly', { params }),
  
  // Get daily revenue data
  getDailyRevenue: (params?: { month?: number; year?: number }) =>
    api.get('/dashboard/revenue/daily', { params }),
  
  // Get recent orders
  getRecentOrders: (limit?: number) =>
    api.get('/dashboard/orders/recent', { params: { limit } }),
  
  // Get low stock products
  getLowStockProducts: () =>
    api.get('/dashboard/products/low-stock'),
  
  // Get top selling products
  getTopSellingProducts: (limit?: number) =>
    api.get('/dashboard/products/top-selling', { params: { limit } }),
  
  // Get sales by category
  getSalesByCategory: () =>
    api.get('/dashboard/sales/by-category'),
  
  // Get customer growth
  getCustomerGrowth: () =>
    api.get('/dashboard/customers/growth'),


  // 3. Payment Method Stats (This caused the error)
  getPaymentMethodStats: () => api.get('/dashboard/payments/methods'),
};


  
  

// ============================================================================
// HELPER FUNCTION FOR INVOICE DOWNLOAD
// ============================================================================
export const downloadInvoice = async (orderId: string, orderNumber: string) => {
  try {
    const blob = await OrderService.getInvoice(orderId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${orderNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download invoice:', error);
    throw error;
  }
};
