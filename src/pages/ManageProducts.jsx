import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Save, X, Upload, Loader } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI, categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';

const ManageProducts = ({ onStatsUpdate }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_active: true,
    image: null
  });
  const [formLoading, setFormLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filterCategory]);

  const fetchProducts = async () => {
    try {
        setLoading(true);
        const response = await productsAPI.getAll({ search: searchTerm, category: filterCategory });
        const data = response.data.results || response.data; // handle paginated or plain list
        setProducts(data);
    } catch (error) {
        toast.error('Failed to load products');
    } finally {
        setLoading(false);
    }
    };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      is_active: true,
      image: null
    });
    setImagePreview(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setFormLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', parseFloat(formData.price));
      data.append('category_id', formData.category_id);
      data.append('is_active', formData.is_active);
      if (formData.image) data.append('image', formData.image);

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, data);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(data);
        toast.success('Product created successfully');
      }

      await fetchProducts();
      if (onStatsUpdate) onStatsUpdate();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.detail || 'Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (product) => {
  setEditingProduct(product);
  setFormData({
    name: product.name,
    description: product.description || '',
    price: product.price.toString(),
    category_id: product.category.id.toString(),
    is_active: product.is_active,
    image: null
  });
  setImagePreview(product.image);
  setShowForm(true); // 👈 opens the modal

  // (Optional) Focus first input after modal opens
  setTimeout(() => {
    document.querySelector('input[name="name"]')?.focus();
  }, 100);
};


  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      await productsAPI.delete(product.id);
      toast.success('Product deleted successfully');
      await fetchProducts();
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const data = new FormData();
      data.append('name', product.name);
      data.append('description', product.description || '');
      data.append('price', product.price);
      data.append('category_id', product.category.id);
      data.append('is_active', !product.is_active);

      await productsAPI.update(product.id, data);
      toast.success(`Product ${!product.is_active ? 'activated' : 'deactivated'}`);
      await fetchProducts();
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Failed to update product status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Manage Products</h2>
            <p className="text-gray-600">Add, edit, and organize your bakery items</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center">
            <Plus size={16} className="mr-2" /> Add Product
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              className="input-field pl-10 pr-8 appearance-none bg-white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input type="text" name="name" required className="input-field" value={formData.name} onChange={handleInputChange} />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" rows="3" className="input-field" value={formData.description} onChange={handleInputChange} />
                </div>

                {/* Price & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input type="number" name="price" required min="0" step="0.01" className="input-field" value={formData.price} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select name="category_id" required className="input-field" value={formData.category_id} onChange={handleInputChange}>
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary-500">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {imagePreview ? (
                        <div className="text-center">
                          <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                          <p className="text-sm text-primary-600">Click to change image</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload image</p>
                          <p className="text-xs text-gray-500">Max 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">Product is active</label>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={resetForm} className="btn-secondary flex-1" disabled={formLoading}>Cancel</button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center" disabled={formLoading}>
                    {formLoading ? (<><Loader className="animate-spin mr-2" size={16} />Saving...</>) : (<><Save className="mr-2" size={16} />{editingProduct ? 'Update' : 'Create'}</>)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin w-8 h-8 text-primary-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{searchTerm || filterCategory ? 'No products found' : 'No products yet'}</h3>
            <p className="text-gray-600 mb-6">{searchTerm || filterCategory ? 'Try adjusting your search or filter criteria' : 'Get started by adding your first product'}</p>
            {!searchTerm && !filterCategory && (
              <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} className="mr-2" /> Add Your First Product</button>
            )}
          </div>
        ) : (
          <>
            {/* <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2"><span className="font-medium text-gray-700">Total:</span><span className="text-gray-900">{products.length}</span></div>
                <div className="flex items-center gap-2"><span className="font-medium text-gray-700">Active:</span><span className="text-green-600">{products.filter(p => p.is_active).length}</span></div>
                <div className="flex items-center gap-2"><span className="font-medium text-gray-700">Inactive:</span><span className="text-red-600">{products.filter(p => !p.is_active).length}</span></div>
              </div>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <ProductCard product={product} showActions={false} className={`transition-all duration-200 ${!product.is_active ? 'opacity-60' : ''}`} />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(product)} className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-lg" title="Edit product"><Edit size={16} /></button>
                      <button onClick={() => handleToggleActive(product)} className={`p-2 rounded-full shadow-lg ${product.is_active ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`} title={product.is_active ? 'Deactivate product' : 'Activate product'}>{product.is_active ? '⏸️' : '▶️'}</button>
                      <button onClick={() => handleDelete(product)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg" title="Delete product"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  {!product.is_active && <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Inactive</div>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
