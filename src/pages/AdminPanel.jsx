import React, { useState, useEffect, useRef } from 'react';
import { Users, Package, Filter, RefreshCw, Download, Calendar } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dobMonth: '',
    registrationDateFrom: '',
    registrationDateTo: ''
  });

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    price: '',
    description: '',
    category_id: '',
    image: null
  });
  const [loading, setLoading] = useState(false);

  const formRef = useRef(null);

  // ---------- SAMPLE CUSTOMERS (for demo) ----------
  const sampleCustomers = [
    { id: 1, fullName: 'Rajesh Kumar', place: 'Kochi', contactNumber: '+91 9876543210', dateOfBirth: '1990-05-15', registrationDate: '2024-01-15' },
    { id: 2, fullName: 'Priya Nair', place: 'Trivandrum', contactNumber: '+91 9876543211', dateOfBirth: '1985-12-10', registrationDate: '2024-02-20' }
  ];

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
      fetchCategories();
    } else if (activeTab === 'customers') {
      setCustomers(sampleCustomers);
    }
  }, [activeTab]);

  useEffect(() => {
    applyFilters();
  }, [customers, filters]);

  // ---------- HELPERS ----------
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getMonthName = (num) =>
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][num - 1];

  // ---------- FILTERS ----------
  const applyFilters = () => {
    let filtered = [...customers];
    if (filters.dobMonth) {
      filtered = filtered.filter(
        (c) => new Date(c.dateOfBirth).getMonth() + 1 === parseInt(filters.dobMonth)
      );
    }
    if (filters.registrationDateFrom) {
      filtered = filtered.filter((c) => c.registrationDate >= filters.registrationDateFrom);
    }
    if (filters.registrationDateTo) {
      filtered = filtered.filter((c) => c.registrationDate <= filters.registrationDateTo);
    }
    setFilteredCustomers(filtered);
  };

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const clearFilters = () => setFilters({ dobMonth: '', registrationDateFrom: '', registrationDateTo: '' });

  const downloadExcel = () => {
    const csvContent = [
      ['Full Name', 'Place', 'Contact Number', 'Date of Birth', 'Registration Date'],
      ...filteredCustomers.map((c) => [
        c.fullName,
        c.place,
        c.contactNumber,
        formatDate(c.dateOfBirth),
        formatDate(c.registrationDate)
      ])
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    toast.success('Customer data downloaded!');
  };

  const refreshCustomers = () => {
    setCustomers(sampleCustomers);
    toast.success('Customers refreshed!');
  };

  // ---------- FORM HANDLERS ----------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description || '');
      data.append('price', parseFloat(formData.price));
      data.append('category_id', formData.category_id);
      data.append('is_active', true);

      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      let response;
      if (formData.id) {
        response = await productsAPI.update(formData.id, data);
        toast.success('Product updated!');
      } else {
        response = await productsAPI.create(data);
        toast.success('Product added!');
      }

      console.log('Saved product:', response.data);
      await fetchProducts();

      // reset form
      setFormData({ id: null, name: '', price: '', description: '', category_id: '', image: null });
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
  setFormData({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description || '',
    category_id: product.category.id,
    image: null // require re-upload if changed
  });

  // scroll to the form
  formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};


  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  // ---------- API CALLS ----------
  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getAll();
      const data = res.data.results || res.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to load products');
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error('Failed to load categories');
      setCategories([]);
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package size={18} /> Manage Products
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'customers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users size={18} /> Customer Registration
          </button>
        </nav>
      </div>

      {/* Products */}
      {activeTab === 'products' && (
        <>
          {/* Form */}
          <div ref={formRef} className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {formData.id ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : formData.id ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>

          {/* Product list */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Products List</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdmin={true}
                    onEdit={() => handleEdit(product)}
                    onDelete={() => handleDelete(product.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No products available</p>
            )}
          </div>
        </>
      )}

      {/* Customers */}
      {activeTab === 'customers' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Customer Registration</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={refreshCustomers}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <RefreshCw size={18} /> Refresh
              </button>
              <button
                onClick={downloadExcel}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download size={18} /> Download Excel
              </button>
            </div>
          </div>
          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold">Full Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Place</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">DOB</th>
                  <th className="px-6 py-3 text-left text-sm font-bold">Reg Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4">{c.fullName}</td>
                    <td className="px-6 py-4">{c.place}</td>
                    <td className="px-6 py-4">{c.contactNumber}</td>
                    <td className="px-6 py-4">{formatDate(c.dateOfBirth)}</td>
                    <td className="px-6 py-4">{formatDate(c.registrationDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
