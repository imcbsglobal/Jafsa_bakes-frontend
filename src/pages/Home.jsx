import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { categoriesAPI, productsAPI } from '../services/api';
import toast from 'react-hot-toast';
import logo from "../assets/logo-js.png";
import Banner from "../components/Banner";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // search states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // category filter
  const [selectedCategory, setSelectedCategory] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const productsRef = useRef(null);

  // debounce logic (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // fetch categories on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // fetch whenever search/category changes
  useEffect(() => {
    fetchProducts();

    if (productsRef.current && (debouncedSearch || selectedCategory)) {
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    setCurrentPage(1); // reset to first page on search/filter
  }, [selectedCategory, debouncedSearch]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      const response = await productsAPI.getAll(params);
      const productsData = response.data.results || response.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCategorySelect = (categorySlug) => setSelectedCategory(categorySlug);
  const refreshProducts = () => fetchProducts();

  // pagination calculations
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Banner images
  const bannerImages = ["/banner1.png", "/banner2.png", "/banner3.png","/banner4.png","/banner5.png",];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-50 to-white-50">
      {/* Hero Section */}
          <div className="bg-white text-black relative overflow-hidden min-h-screen flex flex-col lg:flex-row items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center w-full">
              
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left relative z-10">
                {/* Logo */}
                <div className="mb-6 flex justify-center lg:justify-start">
                  <img 
                    src={logo} 
                    alt="JAFSA Bakes Logo" 
                    className="h-20 w-auto"
                  />
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                  Welcome to JAFSA BAKES
                </h1>
                <p className="text-2xl md:text-3xl text-yellow-700 mb-10">
                  Fresh baked goods made with love, every day
                </p>

                {/* Search Bar */}
                <div className="max-w-md mx-auto lg:mx-0">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={22}
                    />
                    <input
                      type="text"
                      placeholder="Search for delicious items..."
                      className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 focus:ring-4 focus:ring-white focus:outline-none shadow-xl text-lg"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                {/* Menu Button BELOW search bar */}
              <div className="mt-6 flex justify-center lg:justify-start">
                <button
                  onClick={() =>
                    productsRef.current.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-yellow-400 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-full shadow-lg transition duration-300"
                >
                  View Menu
                </button>
              </div>
            </div>
                      
          {/* Right Slider */}
          <div className="flex-1 w-full mt-10 lg:mt-0 flex justify-center items-center">
            <div className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
              {bannerImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="Bakery Banner"
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${
                    index === currentIndex ? "opacity-100 z-10" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img
              src="/bakery.png"
              alt="About JAFSA BAKES"
              className="rounded-2xl shadow-lg w-full max-w-md lg:max-w-lg object-cover"
            />
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
              About <span className="text-yellow-600">JAFSA BAKES</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              With over <span className="font-bold text-yellow-700">10 years of experience</span> 
              in the baking industry, <span className="font-semibold">JAFSA BAKES</span> has 
              been serving our community with fresh, delicious, and high-quality baked goods.  
              We are committed not only to great taste but also to the highest standards of 
              <span className="font-semibold"> food safety and hygiene</span>, ensuring every bite 
              is safe, wholesome, and made with love.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center space-x-3">
                <span className="text-yellow-600 font-bold text-xl">✓</span>
                <span>10+ years of trusted experience</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-yellow-600 font-bold text-xl">✓</span>
                <span>Commitment to food safety & hygiene</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-yellow-600 font-bold text-xl">✓</span>
                <span>Freshly baked goods made daily</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-yellow-600 font-bold text-xl">✓</span>
                <span>A wide range of cakes, snacks, and beverages</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        loading={loading && !products.length}
      />

      {/* Products Section */}
      <div ref={productsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedCategory
                ? `${categories.find(cat => cat.slug === selectedCategory)?.name || 'Category'} Collection`
                : 'Our Delicious Collection'}
            </h2>
            <p className="text-gray-600">
              {debouncedSearch 
                ? `Search results for "${debouncedSearch}"` 
                : 'Discover our freshly baked delights'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={refreshProducts}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            {!loading && (
              <div className="text-sm text-gray-500">
                {products.length} item{products.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin" size={32} />
            <span className="ml-2 text-gray-600">Loading delicious items...</span>
          </div>
        ) : (
          <>
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdmin={false}
                    className="h-full"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {debouncedSearch || selectedCategory 
                    ? 'No items found' 
                    : 'No products available'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {debouncedSearch 
                    ? 'Try searching for something else' 
                    : selectedCategory 
                    ? 'This category is currently empty'
                    : 'Check back later for new items'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-full shadow-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
                >
                  &lt;
                </button>
                <span className="font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-full shadow-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Banner />
    </div>
  );
};

export default Home;
