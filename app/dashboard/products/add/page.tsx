// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { ArrowLeft, Upload, X, Plus, Minus } from 'lucide-react';
// import Button from '@/components/ui/Button';
// import { ProductService } from '@/lib/api';
// import { toast } from 'sonner';
// import { ProductCategory, ProductFormData, CompatibleModel } from '@/types';
// import Link from 'next/link';

// const CATEGORIES: ProductCategory[] = [
//   'Engine',
//   'Brake',
//   'Electrical',
//   'Body',
//   'Accessories',
//   'Suspension',
//   'Transmission',
//   'Interior',
//   'Exterior',
//   'Service Parts',
// ];

// const HYUNDAI_MODELS = [
//   'i10', 'i20', 'Venue', 'Verna', 'Creta', 'Alcazar', 'Tucson',
//   'Elantra', 'Kona', 'Ioniq 5', 'Santro', 'Grand i10', 'Aura'
// ];

// export default function AddProductPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [images, setImages] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
//   const [formData, setFormData] = useState<ProductFormData>({
//     name: '',
//     partNumber: '',
//     description: '',
//     category: 'Engine',
//     subcategory: '',
//     price: 0,
//     stock: 0,
//     lowStockThreshold: 10,
//     warrantyPeriod: '1 Year',
//     manufacturer: 'Hyundai Mobis',
//     compatibleModels: [],
//     tags: [],
//   });

//   const [currentModel, setCurrentModel] = useState<CompatibleModel>({
//     modelName: '',
//     yearFrom: new Date().getFullYear(),
//     yearTo: undefined,
//     variant: '',
//   });

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length + images.length > 5) {
//       toast.error('Maximum 5 images allowed');
//       return;
//     }

//     setImages([...images, ...files]);
    
//     // Create previews
//     files.forEach(file => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreviews(prev => [...prev, reader.result as string]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeImage = (index: number) => {
//     setImages(images.filter((_, i) => i !== index));
//     setImagePreviews(imagePreviews.filter((_, i) => i !== index));
//   };

//   const addCompatibleModel = () => {
//     if (!currentModel.modelName) {
//       toast.error('Please select a model');
//       return;
//     }
    
//     setFormData({
//       ...formData,
//       compatibleModels: [...formData.compatibleModels, currentModel],
//     });
    
//     setCurrentModel({
//       modelName: '',
//       yearFrom: new Date().getFullYear(),
//       yearTo: undefined,
//       variant: '',
//     });
//   };

//   const removeCompatibleModel = (index: number) => {
//     setFormData({
//       ...formData,
//       compatibleModels: formData.compatibleModels.filter((_, i) => i !== index),
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (images.length === 0) {
//       toast.error('Please upload at least one image');
//       return;
//     }

//     if (formData.compatibleModels.length === 0) {
//       toast.error('Please add at least one compatible model');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Create FormData for multipart/form-data
//       const data = new FormData();
      
//       // Append all form fields
//       data.append('name', formData.name);
//       data.append('partNumber', formData.partNumber);
//       data.append('description', formData.description);
//       data.append('category', formData.category);
//       if (formData.subcategory) data.append('subcategory', formData.subcategory);
//       data.append('price', formData.price.toString());
//       if (formData.discountPrice) data.append('discountPrice', formData.discountPrice.toString());
//       data.append('stock', formData.stock.toString());
//       data.append('lowStockThreshold', (formData.lowStockThreshold || 10).toString());
//       data.append('warrantyPeriod', formData.warrantyPeriod || '1 Year');
//       data.append('manufacturer', formData.manufacturer || 'Hyundai Mobis');
      
//       // Append compatible models as JSON string
//       data.append('compatibleModels', JSON.stringify(formData.compatibleModels));
      
//       // Append tags if any
//       if (formData.tags && formData.tags.length > 0) {
//         data.append('tags', JSON.stringify(formData.tags));
//       }
      
//       // Append images
//       images.forEach((image) => {
//         data.append('images', image);
//       });

//       await ProductService.create(data);
      
//       toast.success('Product created successfully!');
//       router.push('/dashboard/products');
//     } catch (error: any) {
//       console.error('Create product error:', error);
//       toast.error(error.response?.data?.message || 'Failed to create product');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex items-center gap-4"
//       >
//         <Link href="/dashboard/products">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="rounded-xl bg-white/5 p-2 backdrop-blur-sm transition-colors hover:bg-white/10"
//           >
//             <ArrowLeft className="h-5 w-5 text-white" />
//           </motion.button>
//         </Link>
//         <div>
//           <h1 className="text-3xl font-bold text-white">Add New Product</h1>
//           <p className="mt-1 text-gray-400">Create a new spare part listing</p>
//         </div>
//       </motion.div>

//       {/* Form */}
//       <motion.form
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//         onSubmit={handleSubmit}
//         className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm"
//       >
//         <div className="space-y-8">
//           {/* Basic Information */}
//           <div>
//             <h2 className="mb-4 text-xl font-semibold text-white">Basic Information</h2>
//             <div className="grid gap-6 md:grid-cols-2">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                   placeholder="e.g., Front Brake Pad Set"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Part Number *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.partNumber}
//                   onChange={(e) => setFormData({ ...formData, partNumber: e.target.value.toUpperCase() })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                   placeholder="e.g., 58101-C9A70"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Description *
//                 </label>
//                 <textarea
//                   required
//                   rows={4}
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                   placeholder="Detailed product description..."
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Category *
//                 </label>
//                 <select
//                   required
//                   value={formData.category}
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                 >
//                   {CATEGORIES.map((cat) => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Subcategory
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.subcategory}
//                   onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                   placeholder="e.g., Brake Pads"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Pricing & Stock */}
//           <div>
//             <h2 className="mb-4 text-xl font-semibold text-white">Pricing & Stock</h2>
//             <div className="grid gap-6 md:grid-cols-4">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Price (₹) *
//                 </label>
//                 <input
//                   type="number"
//                   required
//                   min="0"
//                   value={formData.price}
//                   onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Discount Price (₹)
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   value={formData.discountPrice || ''}
//                   onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Stock Quantity *
//                 </label>
//                 <input
//                   type="number"
//                   required
//                   min="0"
//                   value={formData.stock}
//                   onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Low Stock Alert
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   value={formData.lowStockThreshold}
//                   onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Compatible Models */}
//           <div>
//             <h2 className="mb-4 text-xl font-semibold text-white">Compatible Models</h2>
            
//             <div className="mb-4 grid gap-4 md:grid-cols-5">
//               <div className="md:col-span-2">
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Model *
//                 </label>
//                 <select
//                   value={currentModel.modelName}
//                   onChange={(e) => setCurrentModel({ ...currentModel, modelName: e.target.value })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                 >
//                   <option value="">Select Model</option>
//                   {HYUNDAI_MODELS.map((model) => (
//                     <option key={model} value={model}>{model}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Year From *
//                 </label>
//                 <input
//                   type="number"
//                   value={currentModel.yearFrom}
//                   onChange={(e) => setCurrentModel({ ...currentModel, yearFrom: parseInt(e.target.value) })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                   min="2000"
//                   max={new Date().getFullYear() + 1}
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Year To
//                 </label>
//                 <input
//                   type="number"
//                   value={currentModel.yearTo || ''}
//                   onChange={(e) => setCurrentModel({ ...currentModel, yearTo: e.target.value ? parseInt(e.target.value) : undefined })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                   placeholder="Till date"
//                   min="2000"
//                   max={new Date().getFullYear() + 1}
//                 />
//               </div>

//               <div className="flex items-end">
//                 <Button
//                   type="button"
//                   onClick={addCompatibleModel}
//                   variant="primary"
//                   className="w-full"
//                 >
//                   <Plus className="h-4 w-4" />
//                   Add
//                 </Button>
//               </div>
//             </div>

//             {/* Added Models */}
//             {formData.compatibleModels.length > 0 && (
//               <div className="space-y-2">
//                 {formData.compatibleModels.map((model, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
//                   >
//                     <span className="text-sm text-white">
//                       {model.modelName} ({model.yearFrom} - {model.yearTo || 'Present'})
//                       {model.variant && ` - ${model.variant}`}
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => removeCompatibleModel(index)}
//                       className="text-red-400 hover:text-red-300"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Images */}
//           <div>
//             <h2 className="mb-4 text-xl font-semibold text-white">Product Images</h2>
            
//             <div className="space-y-4">
//               <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 px-6 py-12 transition-colors hover:border-blue-500/50 hover:bg-white/10">
//                 <Upload className="mb-3 h-12 w-12 text-gray-400" />
//                 <span className="text-sm font-medium text-white">
//                   Click to upload images
//                 </span>
//                 <span className="mt-1 text-xs text-gray-400">
//                   PNG, JPG up to 5MB (Max 5 images)
//                 </span>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//               </label>

//               {/* Image Previews */}
//               {imagePreviews.length > 0 && (
//                 <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-5">
//                   {imagePreviews.map((preview, index) => (
//                     <motion.div
//                       key={index}
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       className="group relative aspect-square overflow-hidden rounded-xl border border-white/10"
//                     >
//                       <img
//                         src={preview}
//                         alt={`Preview ${index + 1}`}
//                         className="h-full w-full object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(index)}
//                         className="absolute right-2 top-2 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100"
//                       >
//                         <X className="h-4 w-4 text-white" />
//                       </button>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Additional Details */}
//           <div>
//             <h2 className="mb-4 text-xl font-semibold text-white">Additional Details</h2>
//             <div className="grid gap-6 md:grid-cols-2">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Warranty Period
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.warrantyPeriod}
//                   onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                   placeholder="e.g., 1 Year"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-300">
//                   Manufacturer
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.manufacturer}
//                   onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
//                   className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
//                   placeholder="e.g., Hyundai Mobis"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex gap-4">
//             <Button
//               type="submit"
//               variant="primary"
//               size="lg"
//               isLoading={isLoading}
//               className="flex-1"
//             >
//               Create Product
//             </Button>
//             <Link href="/dashboard/products" className="flex-1">
//               <Button
//                 type="button"
//                 variant="secondary"
//                 size="lg"
//                 className="w-full"
//               >
//                 Cancel
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </motion.form>
//     </div>
//   );
// }




'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, X, Plus, Trash2, Tag, Scale, Ruler } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ProductService } from '@/lib/api';
import { toast } from 'sonner';
import { ProductCategory, CompatibleModel } from '@/types'; // Assuming types exist
import Link from 'next/link';

// Define specific types locally if not in @/types yet
interface ProductFormData {
  name: string;
  partNumber: string;
  description: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  discountPrice?: number;
  stock: number;
  lowStockThreshold: number;
  warrantyPeriod: string;
  manufacturer: string;
  compatibleModels: CompatibleModel[];
  tags: string[];
  weight?: number;
  isActive: boolean;
}

interface Dimensions {
  length: string;
  width: string;
  height: string;
  unit: string;
}

interface SpecificationItem {
  key: string;
  value: string;
}

const CATEGORIES: ProductCategory[] = [
  'Engine', 'Brake', 'Electrical', 'Body', 'Accessories', 
  'Suspension', 'Transmission', 'Interior', 'Exterior', 'Service Parts',
];

const HYUNDAI_MODELS = [
  'i10', 'i20', 'Venue', 'Verna', 'Creta', 'Alcazar', 'Tucson',
  'Elantra', 'Kona', 'Ioniq 5', 'Santro', 'Grand i10', 'Aura', 'Exter'
];

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Main Form Data
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    partNumber: '',
    description: '',
    category: 'Engine',
    subcategory: '',
    price: 0,
    stock: 0,
    lowStockThreshold: 5,
    warrantyPeriod: 'No Warranty',
    manufacturer: 'Hyundai Mobis',
    compatibleModels: [],
    tags: [],
    weight: undefined,
    isActive: true,
  });

  // Complex Nested States
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: '', width: '', height: '', unit: 'cm'
  });

  const [specifications, setSpecifications] = useState<SpecificationItem[]>([
    { key: '', value: '' }
  ]);

  const [currentModel, setCurrentModel] = useState<CompatibleModel>({
    modelName: '',
    yearFrom: new Date().getFullYear(),
    yearTo: undefined,
    variant: '',
  });

  // --- Handlers ---

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages([...images, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // Compatible Models Logic
  const addCompatibleModel = () => {
    if (!currentModel.modelName) {
      toast.error('Please select a model');
      return;
    }
    setFormData(prev => ({
      ...prev,
      compatibleModels: [...prev.compatibleModels, currentModel],
    }));
    setCurrentModel({
      modelName: '',
      yearFrom: new Date().getFullYear(),
      yearTo: undefined,
      variant: '',
    });
  };

  const removeCompatibleModel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      compatibleModels: prev.compatibleModels.filter((_, i) => i !== index),
    }));
  };

  // Specifications Logic
  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addSpecRow = () => setSpecifications([...specifications, { key: '', value: '' }]);
  
  const removeSpecRow = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // Tags Logic
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (formData.compatibleModels.length === 0) {
      toast.error('Please add at least one compatible model');
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      
      // Basic Fields
      data.append('name', formData.name);
      data.append('partNumber', formData.partNumber);
      data.append('description', formData.description);
      data.append('category', formData.category);
      if (formData.subcategory) data.append('subcategory', formData.subcategory);
      data.append('price', formData.price.toString());
      if (formData.discountPrice) data.append('discountPrice', formData.discountPrice.toString());
      data.append('stock', formData.stock.toString());
      data.append('lowStockThreshold', formData.lowStockThreshold.toString());
      data.append('warrantyPeriod', formData.warrantyPeriod);
      data.append('manufacturer', formData.manufacturer);
      data.append('isActive', formData.isActive.toString());

      // Optional Physical Details
      if (formData.weight) data.append('weight', formData.weight.toString());
      
      // Dimensions (Send as JSON)
      const dims = {
        length: parseFloat(dimensions.length) || 0,
        width: parseFloat(dimensions.width) || 0,
        height: parseFloat(dimensions.height) || 0,
        unit: dimensions.unit
      };
      if (dims.length || dims.width || dims.height) {
        data.append('dimensions', JSON.stringify(dims));
      }

      // Arrays & Objects (Send as JSON)
      data.append('compatibleModels', JSON.stringify(formData.compatibleModels));
      
      if (formData.tags.length > 0) {
        data.append('tags', JSON.stringify(formData.tags));
      }

      // Convert Specs Array to Object/Map
      const specsObject = specifications.reduce((acc, curr) => {
        if (curr.key.trim() && curr.value.trim()) {
          acc[curr.key.trim()] = curr.value.trim();
        }
        return acc;
      }, {} as Record<string, string>);
      
      if (Object.keys(specsObject).length > 0) {
        data.append('specifications', JSON.stringify(specsObject));
      }
      
      // Images
      images.forEach((image) => {
        data.append('images', image);
      });

      await ProductService.create(data); // Ensure your API service handles FormData
      
      toast.success('Product created successfully!');
      router.push('/dashboard/products');
    } catch (error: any) {
      console.error('Create product error:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/dashboard/products">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl bg-white/5 p-2 backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </motion.button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Product</h1>
          <p className="mt-1 text-gray-400">Create a new spare part listing</p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm"
      >
        <div className="space-y-8">
          
          {/* 1. Basic Information */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Basic Information</h2>
              {/* Active Toggle */}
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <span className="text-sm font-medium text-gray-300">Status:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  <span className="ms-3 text-sm font-medium text-white">{formData.isActive ? 'Active' : 'Inactive'}</span>
                </label>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Front Brake Pad Set"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Part Number *</label>
                <input
                  type="text"
                  required
                  value={formData.partNumber}
                  onChange={(e) => setFormData({ ...formData, partNumber: e.target.value.toUpperCase() })}
                  className="form-input"
                  placeholder="e.g., 58101-C9A70"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-300">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                  placeholder="Detailed product description..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                  className="form-input"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Subcategory</label>
                <input
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Brake Pads"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* 2. Pricing & Stock */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Pricing & Stock</h2>
            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Discount Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.discountPrice || ''}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Stock Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Low Stock Alert</label>
                <input
                  type="number"
                  min="0"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* 3. Physical Dimensions & Weight (NEW) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
               <Scale className="h-5 w-5 text-blue-400" />
               <h2 className="text-xl font-semibold text-white">Physical Details</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Weight (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="form-input"
                  placeholder="0.00"
                />
              </div>
              <div className="md:col-span-3">
                 <label className="mb-2 block text-sm font-medium text-gray-300">Dimensions (L x W x H)</label>
                 <div className="flex gap-2">
                    <input 
                      type="number" placeholder="Length" 
                      value={dimensions.length} onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                      className="form-input w-full"
                    />
                    <input 
                      type="number" placeholder="Width" 
                      value={dimensions.width} onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                      className="form-input w-full"
                    />
                    <input 
                      type="number" placeholder="Height" 
                      value={dimensions.height} onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                      className="form-input w-full"
                    />
                    <select 
                      value={dimensions.unit} onChange={(e) => setDimensions({...dimensions, unit: e.target.value})}
                      className="form-input w-24"
                    >
                      <option value="cm">cm</option>
                      <option value="mm">mm</option>
                      <option value="m">m</option>
                    </select>
                 </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* 4. Compatible Models */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Compatible Models</h2>
            
            <div className="mb-4 grid gap-4 md:grid-cols-5 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-300">Model *</label>
                <select
                  value={currentModel.modelName}
                  onChange={(e) => setCurrentModel({ ...currentModel, modelName: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Model</option>
                  {HYUNDAI_MODELS.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Year From *</label>
                <input
                  type="number"
                  value={currentModel.yearFrom}
                  onChange={(e) => setCurrentModel({ ...currentModel, yearFrom: parseInt(e.target.value) })}
                  className="form-input"
                  min="2000"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Year To</label>
                <input
                  type="number"
                  value={currentModel.yearTo || ''}
                  onChange={(e) => setCurrentModel({ ...currentModel, yearTo: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="form-input"
                  placeholder="Till date"
                  min="2000"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div className="flex items-end">
                <Button type="button" onClick={addCompatibleModel} variant="primary" className="w-full">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
            </div>

            {formData.compatibleModels.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {formData.compatibleModels.map((model, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-blue-500/10 p-3"
                  >
                    <div className="text-sm">
                      <p className="font-semibold text-blue-200">{model.modelName}</p>
                      <p className="text-blue-300/70 text-xs">
                        {model.yearFrom} - {model.yearTo || 'Present'} {model.variant ? `(${model.variant})` : ''}
                      </p>
                    </div>
                    <button type="button" onClick={() => removeCompatibleModel(index)} className="text-red-400 hover:text-red-300">
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-white/10" />

          {/* 5. Specifications (NEW - Dynamic Map) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Specifications</h2>
            </div>
            
            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Key (e.g. Material)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    className="form-input flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Steel)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    className="form-input flex-1"
                  />
                  {index > 0 && (
                    <button 
                      type="button" 
                      onClick={() => removeSpecRow(index)}
                      className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={addSpecRow} variant="secondary" size="sm" className="mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add Specification
              </Button>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* 6. Tags & Manufacturer */}
          <div>
             <h2 className="mb-4 text-xl font-semibold text-white">Other Details</h2>
             <div className="grid gap-6 md:grid-cols-2">
                <div>
                   <label className="mb-2 block text-sm font-medium text-gray-300">Warranty Period</label>
                   <input
                     type="text"
                     value={formData.warrantyPeriod}
                     onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                     className="form-input"
                     placeholder="e.g., 1 Year"
                   />
                </div>
                <div>
                   <label className="mb-2 block text-sm font-medium text-gray-300">Manufacturer</label>
                   <input
                     type="text"
                     value={formData.manufacturer}
                     onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                     className="form-input"
                     placeholder="e.g., Hyundai Mobis"
                   />
                </div>
             </div>

             <div className="mt-6">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Tag className="h-4 w-4" /> Product Tags
                </label>
                <input 
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="form-input"
                  placeholder="Type a tag and press Enter (e.g., 'oem', 'fast-moving')"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-200 border border-blue-500/30">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
             </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* 7. Product Images */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Product Images</h2>
            <div className="space-y-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 px-6 py-12 transition-colors hover:border-blue-500/50 hover:bg-white/10">
                <Upload className="mb-3 h-12 w-12 text-gray-400" />
                <span className="text-sm font-medium text-white">Click to upload images</span>
                <span className="mt-1 text-xs text-gray-400">PNG, JPG up to 5MB (Max 5 images)</span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {imagePreviews.map((preview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10"
                    >
                      <img src={preview} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="flex-1">
              Create Product
            </Button>
            <Link href="/dashboard/products" className="flex-1">
              <Button type="button" variant="secondary" size="lg" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </motion.form>

      {/* Reusable Input Style Injection */}
      <style jsx global>{`
        .form-input {
          width: 100%;
          border-radius: 0.75rem;
          border-width: 1px;
          border-color: rgba(255, 255, 255, 0.1);
          background-color: rgba(255, 255, 255, 0.05);
          padding-left: 1rem;
          padding-right: 1rem;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          color: white;
          backdrop-filter: blur(4px);
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .form-input:focus {
          border-color: rgba(59, 130, 246, 0.5);
          background-color: rgba(255, 255, 255, 0.1);
          outline: 2px solid transparent;
          outline-offset: 2px;
        }
        .form-input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
