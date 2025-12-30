'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, X, Plus, Trash2, Tag, Scale, Ruler, Save, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ProductService } from '@/lib/api';
import { toast } from 'sonner';
import { ProductCategory, CompatibleModel, Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

// --- Interfaces (Same as Add Page) ---
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

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Existing Images (URLs)
  const [existingImages, setExistingImages] = useState<{url: string, publicId: string}[]>([]);
  // New Images to Upload (Files)
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  
  const [tagInput, setTagInput] = useState('');

  // Form State
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    partNumber: '',
    description: '',
    category: 'Engine',
    subcategory: '',
    price: 0,
    stock: 0,
    lowStockThreshold: 5,
    warrantyPeriod: '',
    manufacturer: '',
    compatibleModels: [],
    tags: [],
    weight: undefined,
    isActive: true,
  });

  const [dimensions, setDimensions] = useState<Dimensions>({
    length: '', width: '', height: '', unit: 'cm'
  });

  const [specifications, setSpecifications] = useState<SpecificationItem[]>([]);

  const [currentModel, setCurrentModel] = useState<CompatibleModel>({
    modelName: '',
    yearFrom: new Date().getFullYear(),
    yearTo: undefined,
    variant: '',
  });

  // --- 1. Fetch Product Data ---
  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      const response = await ProductService.getById(id as string);
      const product: Product = response.data.data.product || response.data;

      // Populate Form
      setFormData({
        name: product.name,
        partNumber: product.partNumber,
        description: product.description,
        category: product.category as ProductCategory,
        subcategory: product.subcategory || '',
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold || 5,
        warrantyPeriod: product.warrantyPeriod || '',
        manufacturer: product.manufacturer || '',
        compatibleModels: product.compatibleModels || [],
        tags: product.tags || [],
        weight: product.weight,
        isActive: product.isActive,
      });

      // Populate Images
      if (product.images) {
        setExistingImages(product.images);
      }

      // Populate Dimensions
      if (product.dimensions) {
        setDimensions({
          length: product.dimensions.length?.toString() || '',
          width: product.dimensions.width?.toString() || '',
          height: product.dimensions.height?.toString() || '',
          unit: product.dimensions.unit || 'cm',
        });
      }

      // Populate Specifications (Convert Map/Object to Array)
      if (product.specifications) {
        const specsArray = Object.entries(product.specifications).map(([key, value]) => ({
          key,
          value: value as string,
        }));
        setSpecifications(specsArray);
      } else {
        setSpecifications([{ key: '', value: '' }]);
      }

    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load product details");
      router.push('/dashboard/products');
    } finally {
      setIsFetching(false);
    }
  };

  // --- 2. Handlers ---

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + newImages.length + files.length;
    
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed in total');
      return;
    }

    setNewImages([...newImages, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setNewImagePreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
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
  const removeSpecRow = (index: number) => setSpecifications(specifications.filter((_, i) => i !== index));

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
  const removeTag = (tag: string) => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));

  // --- 3. Submit Handler (Update) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

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

      if (formData.weight) data.append('weight', formData.weight.toString());
      
      // Dimensions
      const dims = {
        length: parseFloat(dimensions.length) || 0,
        width: parseFloat(dimensions.width) || 0,
        height: parseFloat(dimensions.height) || 0,
        unit: dimensions.unit
      };
      data.append('dimensions', JSON.stringify(dims));

      // Arrays & Objects
      data.append('compatibleModels', JSON.stringify(formData.compatibleModels));
      data.append('tags', JSON.stringify(formData.tags));

      const specsObject = specifications.reduce((acc, curr) => {
        if (curr.key.trim() && curr.value.trim()) acc[curr.key.trim()] = curr.value.trim();
        return acc;
      }, {} as Record<string, string>);
      data.append('specifications', JSON.stringify(specsObject));
      
      // Handle Images
      // 1. Keep Existing Images (Pass as JSON string of publicIds or full objects)
      // Backend should handle "if existingImages provided, keep them"
      data.append('existingImages', JSON.stringify(existingImages));

      // 2. Add New Images
      newImages.forEach((image) => {
        data.append('newImages', image); // Note: Backend key might differ, usually 'images' or specific key
      });

      // NOTE: Ensure your Backend Update Controller handles `existingImages` (to preserve) 
      // and `req.files` (to add new ones).

      await ProductService.update(id as string, data);
      
      toast.success('Product updated successfully!');
      router.push('/dashboard/products');
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <button className="rounded-xl bg-white/5 p-2 transition-colors hover:bg-white/10">
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Product</h1>
            <p className="mt-1 text-gray-400">Update product details and stock</p>
          </div>
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
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-white">{formData.isActive ? 'Active Listing' : 'Draft / Inactive'}</span>
              </label>
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

          {/* 3. Physical & Specifications */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Technical Details</h2>
            <div className="grid gap-6 md:grid-cols-2">
               {/* Dimensions */}
               <div>
                 <div className="flex items-center gap-2 mb-2">
                    <Ruler className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-gray-300">Dimensions (L x W x H)</span>
                 </div>
                 <div className="flex gap-2">
                    <input 
                      type="number" placeholder="L" 
                      value={dimensions.length} onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                      className="form-input w-full"
                    />
                    <input 
                      type="number" placeholder="W" 
                      value={dimensions.width} onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                      className="form-input w-full"
                    />
                    <input 
                      type="number" placeholder="H" 
                      value={dimensions.height} onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                      className="form-input w-full"
                    />
                    <select 
                      value={dimensions.unit} onChange={(e) => setDimensions({...dimensions, unit: e.target.value})}
                      className="form-input w-24"
                    >
                      <option value="cm">cm</option>
                      <option value="mm">mm</option>
                    </select>
                 </div>
               </div>

               {/* Weight */}
               <div>
                 <div className="flex items-center gap-2 mb-2">
                    <Scale className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-300">Weight (kg)</span>
                 </div>
                 <input
                    type="number"
                    step="0.01"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="form-input"
                    placeholder="0.00"
                  />
               </div>
            </div>

            {/* Dynamic Specs */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-300">Specifications</label>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Key"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      className="form-input flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      className="form-input flex-1"
                    />
                    <button type="button" onClick={() => removeSpecRow(index)} className="p-3 rounded-xl bg-red-500/10 text-red-400">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <Button type="button" onClick={addSpecRow} variant="secondary" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Specification
                </Button>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* 4. Compatible Models */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Compatible Models</h2>
            
            {/* Add Model Form */}
            <div className="mb-4 grid gap-4 md:grid-cols-5 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="md:col-span-2">
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
              <input
                type="number"
                placeholder="From Year"
                value={currentModel.yearFrom}
                onChange={(e) => setCurrentModel({ ...currentModel, yearFrom: parseInt(e.target.value) })}
                className="form-input"
              />
              <input
                type="number"
                placeholder="To Year"
                value={currentModel.yearTo || ''}
                onChange={(e) => setCurrentModel({ ...currentModel, yearTo: e.target.value ? parseInt(e.target.value) : undefined })}
                className="form-input"
              />
              <Button type="button" onClick={addCompatibleModel} variant="primary">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>

            {/* List */}
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {formData.compatibleModels.map((model, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-white/10 bg-blue-500/10 p-3">
                  <div className="text-sm">
                    <p className="font-semibold text-blue-200">{model.modelName}</p>
                    <p className="text-blue-300/70 text-xs">{model.yearFrom} - {model.yearTo || 'Present'}</p>
                  </div>
                  <button type="button" onClick={() => removeCompatibleModel(index)} className="text-red-400 hover:text-red-300">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* 5. Images */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Images</h2>
            <div className="space-y-4">
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-sm text-gray-400">Current Images</p>
                  <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-5">
                    {existingImages.map((img, index) => (
                      <div key={index} className="group relative aspect-square overflow-hidden rounded-xl border border-white/10">
                        <Image src={img.url} alt="product" fill className="object-cover" />
                        <button type="button" onClick={() => removeExistingImage(index)} className="absolute right-2 top-2 rounded-full bg-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New */}
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 px-6 py-8 hover:bg-white/10">
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-white">Add New Images</span>
                <input type="file" multiple accept="image/*" onChange={handleNewImageChange} className="hidden" />
              </label>

              {/* New Previews */}
              {newImagePreviews.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-5 mt-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-xl border border-green-500/30">
                      <Image src={preview} alt="new" fill className="object-cover opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-xs font-bold text-white">NEW</div>
                      <button type="button" onClick={() => removeNewImage(index)} className="absolute right-2 top-2 rounded-full bg-red-500 p-1">
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 6. Footer Actions */}
          <div className="flex gap-4 pt-4 border-t border-white/10">
            <Button type="submit" variant="primary" size="lg" isLoading={isSaving} className="flex-1">
              <Save className="h-4 w-4 mr-2" /> Update Product
            </Button>
            <Link href="/dashboard/products" className="flex-1">
              <Button type="button" variant="secondary" size="lg" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>

        </div>
      </motion.form>

      {/* Styles */}
      <style jsx global>{`
        .form-input {
          width: 100%;
          border-radius: 0.75rem;
          border-width: 1px;
          border-color: rgba(255, 255, 255, 0.1);
          background-color: rgba(255, 255, 255, 0.05);
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
          transition: all 0.2s;
        }
        .form-input:focus {
          border-color: rgba(59, 130, 246, 0.5);
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}