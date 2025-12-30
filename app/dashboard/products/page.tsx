// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//   Package,
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   RefreshCcw,
// } from 'lucide-react';
// import Button from '@/components/ui/Button';
// import { TableSkeleton } from '@/components/ui/Skeleton';
// import { ProductService } from '@/lib/api';
// import { Product } from '@/types';
// import { toast } from 'sonner';
// import { formatCurrency, getStockStatusColor, cn } from '@/lib/utils';
// import Image from 'next/image';
// import Link from 'next/link'; // <--- Import this

// export default function ProductsPage() {
//   // ✅ FIX 1: Initialize with empty array
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setIsLoading(true);
//       const response = await ProductService.getAll();
      
//       // Debugging: కన్సోల్ లో రెస్పాన్స్ చెక్ చేయడానికి
//       console.log('📦 Products API Response:', response.data);

//       // ✅ UPDATE: Based on your JSON structure { success: true, data: [ARRAY], ... }
//       // Axios response body is in response.data
//       // So products list is at response.data.data
//       const incomingData = response.data.data || [];

//       if (Array.isArray(incomingData)) {
//         setProducts(incomingData);
//       } else {
//         console.error('Invalid products data format. Expected Array, got:', incomingData);
//         setProducts([]); // Fallback to empty array
//       }
//     } catch (error: any) {
//       console.error('Products fetch error:', error);
//       toast.error('Failed to fetch products');
//       setProducts([]); 
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteProduct = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;
    
//     try {
//       await ProductService.delete(id);
//       toast.success('Product deleted successfully');
//       fetchProducts(); // Refresh list
//     } catch (error) {
//       toast.error('Failed to delete product');
//     }
//   };

//   // ✅ FIX 3: Safe Filtering Logic
//   const safeProducts = Array.isArray(products) ? products : [];

//   const filteredProducts = safeProducts.filter((product) => {
//     const matchesSearch =
//       (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (product.partNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory =
//       selectedCategory === 'All' || product.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   // Calculate Categories safely
//   const categories = ['All', ...new Set(safeProducts.map((p) => p.category).filter(Boolean))];

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-3xl font-bold text-white">Products</h1>
//         </div>
//         <TableSkeleton />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
//       >
//         <div>
//           <h1 className="text-3xl font-bold text-white">Products</h1>
//           <p className="mt-1 text-gray-400">
//             Manage your spare parts inventory
//           </p>
//         </div>
//         <div className="flex gap-2">
//            <button 
//              onClick={fetchProducts}
//              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
//            >
//              <RefreshCcw className="h-4 w-4" />
//              Refresh
//            </button>
//            <Link href="products/add">
//              <Button variant="primary" size="md">
//                <Plus className="h-4 w-4 mr-2" />
//                Add Product
//              </Button>
//            </Link>
//         </div>
//       </motion.div>

//       {/* Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1, duration: 0.5 }}
//         className="flex flex-wrap items-center gap-4"
//       >
//         {/* Search */}
//         <div className="relative flex-1 min-w-[300px]">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name or part number..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//           />
//         </div>

//         {/* Category Filter */}
//         <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm scrollbar-hide">
//           {categories.map((category) => (
//             <motion.button
//               key={category}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setSelectedCategory(category)}
//               className={cn(
//                 'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all',
//                 selectedCategory === category
//                   ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
//                   : 'text-gray-400 hover:text-white'
//               )}
//             >
//               {category}
//             </motion.button>
//           ))}
//         </div>
//       </motion.div>

//       {/* Stats */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2, duration: 0.5 }}
//         className="grid gap-4 sm:grid-cols-3"
//       >
//         <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
//           <p className="text-sm text-gray-400">Total Products</p>
//           <p className="mt-1 text-2xl font-bold text-white">{safeProducts.length}</p>
//         </div>
//         <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
//           <p className="text-sm text-gray-400">Low Stock Items</p>
//           <p className="mt-1 text-2xl font-bold text-yellow-400">
//             {safeProducts.filter((p) => p.stockStatus === 'Low Stock').length}
//           </p>
//         </div>
//         <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
//           <p className="text-sm text-gray-400">Out of Stock</p>
//           <p className="mt-1 text-2xl font-bold text-red-400">
//             {safeProducts.filter((p) => p.stockStatus === 'Out of Stock').length}
//           </p>
//         </div>
//       </motion.div>

//       {/* Products Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3, duration: 0.5 }}
//         className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
//       >
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-white/10 bg-white/5">
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
//                   Product
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
//                   Part Number
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
//                   Category
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
//                   Price
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
//                   Stock
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {filteredProducts.length === 0 ? (
//                  <tr>
//                   <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
//                     <Package className="h-12 w-12 mx-auto mb-3 text-gray-600" />
//                     <p>No products found</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredProducts.map((product, index) => (
//                   <motion.tr
//                     key={product._id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.05 * index, duration: 0.3 }}
//                     whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
//                     className="transition-colors"
//                   >
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
//                           {product.images && product.images[0] ? (
//                             <Image
//                               src={product.images[0].url}
//                               alt={product.name}
//                               fill
//                               className="object-cover"
//                             />
//                           ) : (
//                             <div className="flex h-full w-full items-center justify-center text-gray-500">
//                               <Package className="h-6 w-6" />
//                             </div>
//                           )}
//                         </div>
//                         <div>
//                           <p className="font-medium text-white">{product.name}</p>
//                           <p className="text-xs text-gray-400">
//                             {product.subcategory || product.category}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <code className="rounded bg-white/5 px-2 py-1 text-xs text-cyan-400">
//                         {product.partNumber}
//                       </code>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
//                         {product.category}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div>
//                         <p className="font-semibold text-white">
//                           {formatCurrency(product.finalPrice || product.price)}
//                         </p>
//                         {product.discountPrice && product.discountPrice < product.price && (
//                           <p className="text-xs text-gray-400 line-through">
//                             {formatCurrency(product.price)}
//                           </p>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <span className="font-medium text-white">
//                           {product.stock}
//                         </span>
//                         <span
//                           className={cn(
//                             'text-xs font-medium px-2 py-0.5 rounded-full',
//                             product.stock > (product.lowStockThreshold || 5) ? 'bg-green-500/10 text-green-400' :
//                             product.stock > 0 ? 'bg-yellow-500/10 text-yellow-400' :
//                             'bg-red-500/10 text-red-400'
//                           )}
//                         >
//                           {product.stockStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock')}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           className="rounded-lg bg-blue-500/10 p-2 text-blue-400 transition-colors hover:bg-blue-500/20"
//                           title="View Details"
//                         >
//                           <Eye className="h-4 w-4" />
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           className="rounded-lg bg-yellow-500/10 p-2 text-yellow-400 transition-colors hover:bg-yellow-500/20"
//                           title="Edit Product"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => handleDeleteProduct(product._id)}
//                           className="rounded-lg bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20"
//                           title="Delete Product"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </motion.button>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>
//     </div>
//   );
// }






// 'use client';

// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
// import {
//   Package,
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   RefreshCcw,
//   Car,
//   AlertTriangle, // Import Alert Icon
//   X,
// } from 'lucide-react';
// import Button from '@/components/ui/Button';
// import { TableSkeleton } from '@/components/ui/Skeleton';
// import { ProductService } from '@/lib/api';
// import { Product } from '@/types';
// import { toast } from 'sonner';
// import { formatCurrency, cn } from '@/lib/utils';
// import Image from 'next/image';
// import Link from 'next/link';

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');

//   // --- DELETE MODAL STATE ---
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setIsLoading(true);
//       const response = await ProductService.getAll();
//       const incomingData = response.data.data || [];

//       if (Array.isArray(incomingData)) {
//         setProducts(incomingData);
//       } else {
//         setProducts([]);
//       }
//     } catch (error: any) {
//       console.error('Products fetch error:', error);
//       toast.error('Failed to fetch products');
//       setProducts([]); 
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 1. Open Modal
//   const openDeleteModal = (id: string) => {
//     setDeleteId(id);
//   };

//   // 2. Close Modal
//   const closeDeleteModal = () => {
//     setDeleteId(null);
//   };

//   // 3. Execute Delete (API Call)
//   const executeDelete = async () => {
//     if (!deleteId) return;

//     setIsDeleting(true);
//     try {
//       await ProductService.delete(deleteId);
//       toast.success('Product deleted successfully');
//       // Remove from UI
//       setProducts(prev => prev.filter(p => p._id !== deleteId));
//       closeDeleteModal();
//     } catch (error: any) {
//       console.error("Delete Error:", error);
//       toast.error(error.response?.data?.message || 'Failed to delete product');
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const safeProducts = Array.isArray(products) ? products : [];

//   const filteredProducts = safeProducts.filter((product) => {
//     const matchesSearch =
//       (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (product.partNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory =
//       selectedCategory === 'All' || product.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const categories = ['All', ...new Set(safeProducts.map((p) => p.category).filter(Boolean))];

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-3xl font-bold text-white">Products</h1>
//         </div>
//         <TableSkeleton />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 pb-20">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
//       >
//         <div>
//           <h1 className="text-3xl font-bold text-white">Products</h1>
//           <p className="mt-1 text-gray-400">
//             Manage your spare parts inventory
//           </p>
//         </div>
//         <div className="flex gap-2">
//            <button 
//              onClick={fetchProducts}
//              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
//            >
//              <RefreshCcw className="h-4 w-4" />
//              Refresh
//            </button>
//            <Link href="/dashboard/products/add">
//              <Button variant="primary" size="md">
//                <Plus className="h-4 w-4 mr-2" />
//                Add Product
//              </Button>
//            </Link>
//         </div>
//       </motion.div>

//       {/* Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1, duration: 0.5 }}
//         className="flex flex-wrap items-center gap-4"
//       >
//         <div className="relative flex-1 min-w-[300px]">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name or part number..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//           />
//         </div>

//         <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm scrollbar-hide">
//           {categories.map((category) => (
//             <motion.button
//               key={category}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setSelectedCategory(category)}
//               className={cn(
//                 'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all',
//                 selectedCategory === category
//                   ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
//                   : 'text-gray-400 hover:text-white'
//               )}
//             >
//               {category}
//             </motion.button>
//           ))}
//         </div>
//       </motion.div>

//       {/* Products Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3, duration: 0.5 }}
//         className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
//       >
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-white/10 bg-white/5">
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Product</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Category</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Models</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Price</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Stock</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {filteredProducts.length === 0 ? (
//                  <tr>
//                   <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
//                     <Package className="h-12 w-12 mx-auto mb-3 text-gray-600" />
//                     <p>No products found</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredProducts.map((product, index) => (
//                   <motion.tr
//                     key={product._id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.05 * index, duration: 0.3 }}
//                     whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
//                     className="transition-colors group"
//                   >
//                     {/* ... (Existing Columns: Product, Category, Models, Price, Stock) ... */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
//                           {product.images && product.images[0] ? (
//                             <Image src={product.images[0].url} alt={product.name} fill className="object-cover transition-transform group-hover:scale-110" />
//                           ) : (
//                             <div className="flex h-full w-full items-center justify-center text-gray-500"><Package className="h-6 w-6" /></div>
//                           )}
//                         </div>
//                         <div>
//                           <p className="font-medium text-white line-clamp-1">{product.name}</p>
//                           <code className="text-xs text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">{product.partNumber}</code>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">{product.category}</span>
//                     </td>
//                     <td className="px-6 py-4 max-w-[200px]">
//                       <div className="flex flex-wrap gap-1">
//                         {product.compatibleModels?.slice(0, 2).map((model, i) => (
//                            <span key={i} className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-[10px] text-gray-300 border border-white/10">
//                               <Car className="h-3 w-3 text-gray-500" />{model.modelName}
//                            </span>
//                         ))}
//                         {product.compatibleModels?.length > 2 && <span className="text-[10px] text-gray-500 pl-1">+{product.compatibleModels.length - 2} more</span>}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                         <p className="font-semibold text-white">{formatCurrency(product.finalPrice || product.price)}</p>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', product.stock > (product.lowStockThreshold || 5) ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20')}>
//                           {product.stockStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock')}
//                       </span>
//                     </td>

//                     {/* ACTIONS COLUMN */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <Link href={`/dashboard/products/${product._id}`}>
//                             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="rounded-lg bg-blue-500/10 p-2 text-blue-400 transition-colors hover:bg-blue-500/20" title="View Details"><Eye className="h-4 w-4" /></motion.button>
//                         </Link>
//                         <Link href={`/dashboard/products/edit/${product._id}`}>
//                             <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="rounded-lg bg-yellow-500/10 p-2 text-yellow-400 transition-colors hover:bg-yellow-500/20" title="Edit Product"><Edit className="h-4 w-4" /></motion.button>
//                         </Link>
//                         {/* Trigger Delete Modal */}
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => openDeleteModal(product._id)}
//                           className="rounded-lg bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20"
//                           title="Delete Product"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </motion.button>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>

//       {/* --- BEAUTIFUL DELETE CONFIRMATION MODAL --- */}
//       <AnimatePresence>
//         {deleteId && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             {/* Backdrop with Blur */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={closeDeleteModal}
//               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             />

//             {/* Modal Content */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl"
//             >
//               {/* Close Button */}
//               <button 
//                 onClick={closeDeleteModal} 
//                 className="absolute right-4 top-4 text-gray-400 hover:text-white"
//               >
//                 <X className="h-5 w-5" />
//               </button>

//               <div className="flex flex-col items-center text-center">
//                 {/* Warning Icon */}
//                 <div className="mb-4 rounded-full bg-red-500/10 p-4">
//                   <AlertTriangle className="h-8 w-8 text-red-500" />
//                 </div>

//                 <h3 className="mb-2 text-xl font-bold text-white">Delete Product?</h3>
//                 <p className="mb-6 text-sm text-gray-400 leading-relaxed">
//                   Are you sure you want to delete this product? <br/>
//                   This action cannot be undone and will remove the item from inventory.
//                 </p>

//                 <div className="flex w-full gap-3">
//                   <button
//                     onClick={closeDeleteModal}
//                     disabled={isDeleting}
//                     className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={executeDelete}
//                     disabled={isDeleting}
//                     className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50 flex justify-center items-center gap-2"
//                   >
//                      {isDeleting ? (
//                        <>
//                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                          <span>Deleting...</span>
//                        </>
//                      ) : (
//                        <>
//                          <Trash2 className="h-4 w-4" />
//                          <span>Delete Forever</span>
//                        </>
//                      )}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }











// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//   Package,
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   RefreshCcw,
//   Car, // Added Car icon for models
// } from 'lucide-react';
// import Button from '@/components/ui/Button';
// import { TableSkeleton } from '@/components/ui/Skeleton';
// import { ProductService } from '@/lib/api';
// import { Product } from '@/types';
// import { toast } from 'sonner';
// import { formatCurrency, cn } from '@/lib/utils';
// import Image from 'next/image';
// import Link from 'next/link';

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setIsLoading(true);
//       const response = await ProductService.getAll();
//       const incomingData = response.data.data || [];

//       if (Array.isArray(incomingData)) {
//         setProducts(incomingData);
//       } else {
//         setProducts([]);
//       }
//     } catch (error: any) {
//       console.error('Products fetch error:', error);
//       toast.error('Failed to fetch products');
//       setProducts([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteProduct = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
//     try {
//       await ProductService.delete(id);
//       toast.success('Product deleted successfully');
//       // Optimistic update or refetch
//       setProducts(products.filter(p => p._id !== id));
//     } catch (error: any) {
//       console.error("Delete Error:", error);
//       toast.error(error.response?.data?.message || 'Failed to delete product');
//     }
//   };

//   // Safe Filtering Logic
//   const safeProducts = Array.isArray(products) ? products : [];

//   const filteredProducts = safeProducts.filter((product) => {
//     const matchesSearch =
//       (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (product.partNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory =
//       selectedCategory === 'All' || product.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const categories = ['All', ...new Set(safeProducts.map((p) => p.category).filter(Boolean))];

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-3xl font-bold text-white">Products</h1>
//         </div>
//         <TableSkeleton />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 pb-20">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
//       >
//         <div>
//           <h1 className="text-3xl font-bold text-white">Products</h1>
//           <p className="mt-1 text-gray-400">
//             Manage your spare parts inventory
//           </p>
//         </div>
//         <div className="flex gap-2">
//            <button 
//              onClick={fetchProducts}
//              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
//            >
//              <RefreshCcw className="h-4 w-4" />
//              Refresh
//            </button>
//            <Link href="/dashboard/products/add">
//              <Button variant="primary" size="md">
//                <Plus className="h-4 w-4 mr-2" />
//                Add Product
//              </Button>
//            </Link>
//         </div>
//       </motion.div>

//       {/* Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1, duration: 0.5 }}
//         className="flex flex-wrap items-center gap-4"
//       >
//         {/* Search */}
//         <div className="relative flex-1 min-w-[300px]">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name, part number..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//           />
//         </div>

//         {/* Category Filter */}
//         <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm scrollbar-hide">
//           {categories.map((category) => (
//             <motion.button
//               key={category}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setSelectedCategory(category)}
//               className={cn(
//                 'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all',
//                 selectedCategory === category
//                   ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
//                   : 'text-gray-400 hover:text-white'
//               )}
//             >
//               {category}
//             </motion.button>
//           ))}
//         </div>
//       </motion.div>

//       {/* Stats Cards */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2, duration: 0.5 }}
//         className="grid gap-4 sm:grid-cols-3"
//       >
//         <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
//           <p className="text-sm text-gray-400">Total Products</p>
//           <p className="mt-1 text-2xl font-bold text-white">{safeProducts.length}</p>
//         </div>
//         <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
//           <p className="text-sm text-gray-400">Low Stock Items</p>
//           <p className="mt-1 text-2xl font-bold text-yellow-400">
//             {safeProducts.filter((p) => p.stockStatus === 'Low Stock').length}
//           </p>
//         </div>
//         <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
//           <p className="text-sm text-gray-400">Out of Stock</p>
//           <p className="mt-1 text-2xl font-bold text-red-400">
//             {safeProducts.filter((p) => p.stockStatus === 'Out of Stock').length}
//           </p>
//         </div>
//       </motion.div>

//       {/* Products Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3, duration: 0.5 }}
//         className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
//       >
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-white/10 bg-white/5">
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Product</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Category</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Models</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Price</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Stock</th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {filteredProducts.length === 0 ? (
//                  <tr>
//                   <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
//                     <Package className="h-12 w-12 mx-auto mb-3 text-gray-600" />
//                     <p>No products found</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredProducts.map((product, index) => (
//                   <motion.tr
//                     key={product._id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.05 * index, duration: 0.3 }}
//                     whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
//                     className="transition-colors group"
//                   >
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
//                           {product.images && product.images[0] ? (
//                             <Image
//                               src={product.images[0].url}
//                               alt={product.name}
//                               fill
//                               className="object-cover transition-transform group-hover:scale-110"
//                             />
//                           ) : (
//                             <div className="flex h-full w-full items-center justify-center text-gray-500">
//                               <Package className="h-6 w-6" />
//                             </div>
//                           )}
//                         </div>
//                         <div>
//                           <p className="font-medium text-white line-clamp-1">{product.name}</p>
//                           <code className="text-xs text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">
//                             {product.partNumber}
//                           </code>
//                         </div>
//                       </div>
//                     </td>
                    
//                     <td className="px-6 py-4">
//                       <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
//                         {product.category}
//                       </span>
//                       {product.subcategory && (
//                         <p className="text-[10px] text-gray-500 mt-1 ml-2">{product.subcategory}</p>
//                       )}
//                     </td>

//                     {/* NEW: Compatible Models Column */}
//                     <td className="px-6 py-4 max-w-[200px]">
//                       <div className="flex flex-wrap gap-1">
//                         {product.compatibleModels?.slice(0, 3).map((model, i) => (
//                            <span key={i} className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-[10px] text-gray-300 border border-white/10">
//                               <Car className="h-3 w-3 text-gray-500" />
//                               {model.modelName}
//                            </span>
//                         ))}
//                         {product.compatibleModels?.length > 3 && (
//                            <span className="text-[10px] text-gray-500 pl-1">
//                              +{product.compatibleModels.length - 3} more
//                            </span>
//                         )}
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div>
//                         <p className="font-semibold text-white">
//                           {formatCurrency(product.finalPrice || product.price)}
//                         </p>
//                         {product.discountPrice && product.discountPrice < product.price && (
//                           <p className="text-xs text-gray-400 line-through">
//                             {formatCurrency(product.price)}
//                           </p>
//                         )}
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <span className="font-medium text-white">
//                           {product.stock}
//                         </span>
//                         <span
//                           className={cn(
//                             'text-[10px] font-medium px-2 py-0.5 rounded-full border',
//                             product.stockStatus === 'In Stock' 
//                                 ? 'bg-green-500/10 text-green-400 border-green-500/20' 
//                                 : product.stockStatus === 'Low Stock'
//                                 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
//                                 : 'bg-red-500/10 text-red-400 border-red-500/20'
//                           )}
//                         >
//                           {product.stockStatus}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         {/* VIEW ACTION */}
//                         <Link href={`/dashboard/products/${product._id}`}>
//                             <motion.button
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                             className="rounded-lg bg-blue-500/10 p-2 text-blue-400 transition-colors hover:bg-blue-500/20"
//                             title="View Details"
//                             >
//                             <Eye className="h-4 w-4" />
//                             </motion.button>
//                         </Link>
                        
//                         {/* EDIT ACTION */}
//                         <Link href={`/dashboard/products/edit/${product._id}`}>
//                             <motion.button
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                             className="rounded-lg bg-yellow-500/10 p-2 text-yellow-400 transition-colors hover:bg-yellow-500/20"
//                             title="Edit Product"
//                             >
//                             <Edit className="h-4 w-4" />
//                             </motion.button>
//                         </Link>
                        
//                         {/* DELETE ACTION */}
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => handleDeleteProduct(product._id)}
//                           className="rounded-lg bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20"
//                           title="Delete Product"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </motion.button>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>
//     </div>
//   );
// }


















'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCcw,
  Car,
  AlertTriangle,
  X,
  Layers,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { ProductService } from '@/lib/api';
import { Product } from '@/types';
import { toast } from 'sonner';
import { formatCurrency, cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // --- DELETE MODAL STATE ---
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await ProductService.getAll();
      const incomingData = response.data.data || [];

      if (Array.isArray(incomingData)) {
        setProducts(incomingData);
      } else {
        setProducts([]);
      }
    } catch (error: any) {
      console.error('Products fetch error:', error);
      toast.error('Failed to fetch products');
      setProducts([]); 
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Open Modal
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
  };

  // 2. Close Modal
  const closeDeleteModal = () => {
    setDeleteId(null);
  };

  // 3. Execute Delete (API Call)
  const executeDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await ProductService.delete(deleteId);
      toast.success('Product deleted successfully');
      setProducts(prev => prev.filter(p => p._id !== deleteId));
      closeDeleteModal();
    } catch (error: any) {
      console.error("Delete Error:", error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter((product) => {
    const matchesSearch =
      (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.partNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(safeProducts.map((p) => p.category).filter(Boolean))];

  // Calculate Summary Stats
  const totalProducts = safeProducts.length;
  const lowStockCount = safeProducts.filter(p => p.stock <= (p.lowStockThreshold || 5)).length;
  const outOfStockCount = safeProducts.filter(p => p.stock === 0).length;
  const totalInventoryValue = safeProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Products</h1>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="mt-1 text-gray-400">
            Manage your spare parts inventory
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={fetchProducts}
             className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
           >
             <RefreshCcw className="h-4 w-4" />
             Refresh
           </button>
           <Link href="/dashboard/products/add">
             <Button variant="primary" size="md">
               <Plus className="h-4 w-4 mr-2" />
               Add Product
             </Button>
           </Link>
        </div>
      </motion.div>

      {/* --- SUMMARY CARDS SECTION --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="rounded-xl border border-white/10 bg-[#141414] p-4 transition-colors hover:bg-white/5">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-white">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#141414] p-4 transition-colors hover:bg-white/5">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-yellow-500/10 p-3 text-yellow-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Low Stock</p>
              <p className="text-2xl font-bold text-white">{lowStockCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#141414] p-4 transition-colors hover:bg-white/5">
          <div className="flex items-center gap-4">
             <div className="rounded-lg bg-red-500/10 p-3 text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold text-white">{outOfStockCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#141414] p-4 transition-colors hover:bg-white/5">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-500/10 p-3 text-green-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalInventoryValue)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-wrap items-center gap-4"
      >
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or part number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm scrollbar-hide">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all',
                selectedCategory === category
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Products Table */}
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
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Models</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length === 0 ? (
                 <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <Package className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                    <p>No products found</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.3 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                    className="transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
                          {product.images && product.images[0] ? (
                            <Image src={product.images[0].url} alt={product.name} fill className="object-cover transition-transform group-hover:scale-110" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-500"><Package className="h-6 w-6" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white line-clamp-1">{product.name}</p>
                          <code className="text-xs text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">{product.partNumber}</code>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {product.compatibleModels?.slice(0, 2).map((model, i) => (
                           <span key={i} className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-[10px] text-gray-300 border border-white/10">
                              <Car className="h-3 w-3 text-gray-500" />{model.modelName}
                           </span>
                        ))}
                        {product.compatibleModels?.length > 2 && <span className="text-[10px] text-gray-500 pl-1">+{product.compatibleModels.length - 2} more</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <p className="font-semibold text-white">{formatCurrency(product.finalPrice || product.price)}</p>
                    </td>
                    
                    {/* --- UPDATED STOCK COLUMN --- */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-semibold text-white">{product.stock} Units</span>
                        <span className={cn('text-[10px] w-fit font-medium px-2 py-0.5 rounded-full border', 
                          product.stock > (product.lowStockThreshold || 5) 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : product.stock === 0 
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        )}>
                            {product.stockStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock')}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/products/${product._id}`}>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="rounded-lg bg-blue-500/10 p-2 text-blue-400 transition-colors hover:bg-blue-500/20" title="View Details"><Eye className="h-4 w-4" /></motion.button>
                        </Link>
                        <Link href={`/dashboard/products/edit/${product._id}`}>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="rounded-lg bg-yellow-500/10 p-2 text-yellow-400 transition-colors hover:bg-yellow-500/20" title="Edit Product"><Edit className="h-4 w-4" /></motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDeleteModal(product._id)}
                          className="rounded-lg bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl"
            >
              <button onClick={closeDeleteModal} className="absolute right-4 top-4 text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-red-500/10 p-4">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Delete Product?</h3>
                <p className="mb-6 text-sm text-gray-400 leading-relaxed">
                  Are you sure you want to delete this product? <br/>
                  This action cannot be undone and will remove the item from inventory.
                </p>
                <div className="flex w-full gap-3">
                  <button
                    onClick={closeDeleteModal}
                    disabled={isDeleting}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeDelete}
                    disabled={isDeleting}
                    className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                     {isDeleting ? (
                       <>
                         <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                         <span>Deleting...</span>
                       </>
                     ) : (
                       <>
                         <Trash2 className="h-4 w-4" />
                         <span>Delete Forever</span>
                       </>
                     )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}