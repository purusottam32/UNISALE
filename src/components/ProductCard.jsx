import React from 'react';
import { FaRegHeart, FaStar } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const imageUrl = product.images && product.images[0] ? product.images[0] : '/fallback.svg';

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={product.title}
          loading="lazy"
        //   onError={(e) => { e.currentTarget.src = '/fallback.svg'; }}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100">
          <FaRegHeart className="text-red-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-[#131712] font-medium text-sm line-clamp-2 mb-1">
          {product.title}
        </h3>

        {/* Brief */}
        <p className="text-[#6d8566] text-xs line-clamp-1 mb-2">
          {product.brief}
        </p>

        {/* Condition & Used Duration */}
        <div className="flex gap-2 text-xs mb-2">
          <span className="bg-[#f1f4f1] text-[#6d8566] px-2 py-1 rounded">
            {product.condition}
          </span>
          <span className="text-[#6d8566]">
            {product.usedDuration}
          </span>
        </div>

        {/* Price */}
        <p className="text-[#131712] font-bold text-lg mb-2">
          ₹ {product.price.toLocaleString()}
        </p>

        {/* Seller Info */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="text-[#131712] font-medium">{product.seller.name}</p>
            <p className="text-[#6d8566]">{product.seller.campus}</p>
          </div>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" size={12} />
            <span className="text-[#6d8566] font-medium">{product.seller.rating}</span>
          </div>
        </div>

        {/* Posted date */}
        <p className="text-[#6d8566] text-xs mt-2">
          Posted {product.postedAt}
        </p>
      </div>
    </div>
  );
}
