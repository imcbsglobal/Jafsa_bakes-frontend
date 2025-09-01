import React from 'react';
import { Edit, Trash2, Star } from 'lucide-react';

const StarRating = ({ rating = 5 }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

const CategoryBadge = ({ category }) => {
  const categoryColor = 'bg-amber-100 text-amber-800 border-amber-200';
  return (
    <span
      className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full border z-10 ${categoryColor}`}
    >
      {category?.name || 'Uncategorized'}
    </span>
  );
};

const ProductCard = ({
  product,
  isAdmin = false,
  onEdit,
  onDelete,
  onToggleActive,
  showActions = true,
  className = '',
}) => {
  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";


  const handleImageError = (e) => {
    e.target.src = "/placeholder.png"; // fallback image in /public folder
  };

  // Ensure absolute URL for image
  const imageUrl =
    product.image && (product.image.startsWith("http")
      ? product.image
      : `${backendUrl}${product.image}`);

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group ${className}`}
    >
      {/* Product Image Container */}
      <div className="relative h-64 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            No Image
          </div>
        )}

        {/* Category Badge */}
        <CategoryBadge category={product.category} />

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 bg-white bg-opacity-95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
          <span className="text-lg font-bold text-yellow-600">₹{product.price}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Product Name */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight min-h-[3.5rem]">
            {product.name}
          </h3>
        </div>

        {/* Product Description */}
        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed min-h-[4rem]">
            {product.description}
          </p>
        )}

        {/* Bottom Section */}
        <div className="flex justify-between items-center">
          {isAdmin && showActions && (
            <div className="flex space-x-2">
              {/* Edit Button */}
              <button
                onClick={() => onEdit?.(product)}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                title="Edit Product"
              >
                <Edit size={18} /> Edit
              </button>

              {/* Delete Button */}
              <button
                onClick={() => onDelete?.(product)}
                className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                title="Delete Product"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
