import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory, loading }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <div className="flex-1 flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex-shrink-0 h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 shadow-sm border-b sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 z-50"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Scrollable Categories */}
        <div
          ref={scrollRef}
          className="flex-1 flex space-x-3 overflow-x-auto scrollbar-hide px-10"
        >
          {/* All Categories Button */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              selectedCategory === null
                ? "bg-yellow-500 text-white shadow-lg transform scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
            }`}
          >
            All Items
          </button>

          {/* Category Buttons */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.slug)}
              className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedCategory === category.slug
                  ? "bg-yellow-500 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 z-50"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;
