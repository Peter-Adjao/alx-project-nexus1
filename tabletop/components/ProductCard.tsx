/**
 * ProductCard Component - Individual product display with interactive features
 * Features:
 * - Supports both grid and list view modes
 * - Optimized images with fallback handling
 * - Interactive wishlist and cart functionality
 * - Smooth hover animations and effects
 * - Accessible design with proper ARIA labels
 */

import { Heart, Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { useWishlist } from "./WishlistContext";
import { useState, useCallback } from "react";
import { ImageWithFallback } from "./fallback/ImageWithFallback";

// Product interface with proper typing for type safety
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // For displaying discounted prices
  rating: number; // Product rating out of 5
  reviewCount: number; // Number of user reviews
  image: string; // Product image URL
  category: string; // Product category
  isNew?: boolean; // Whether product is newly added
  isSale?: boolean; // Whether product is on sale
  salePercentage?: number; // Discount percentage for sales
  isSoldOut?: boolean; // Whether product is out of stock
}

// Component props interface for type safety
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void; // Callback when item added to cart
  onWishlistToggle?: (productId: string) => void; // Callback when wishlist toggled (unused but kept for compatibility)
  onViewProduct?: (productId: string) => void; // Callback when product viewed
  viewMode?: "grid" | "list"; // Display mode
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onViewProduct, 
  viewMode = "grid" 
}: ProductCardProps) {
  // State for hover effects and interactions
  // Using useState for immediate UI feedback on hover
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  // Wishlist context for managing wishlist state across the app
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Check if current product is in wishlist
  const isWishlisted = isInWishlist(product.id);

  /**
   * Handle wishlist toggle functionality
   * Adds or removes product from wishlist based on current state
   * Uses useCallback to prevent unnecessary re-renders when parent re-renders
   */
  const handleWishlistClick = useCallback(() => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      console.log(`Removed product ${product.id} from wishlist`);
    } else {
      // Add product to wishlist with required fields
      addToWishlist({
        id: product.id,
        title: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image
      });
      console.log(`Added product ${product.id} to wishlist`);
    }
  }, [isWishlisted, product, addToWishlist, removeFromWishlist]);

  /**
   * Handle add to cart with event propagation prevention
   * Prevents triggering card click when cart button is clicked
   * Uses useCallback for performance optimization
   */
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card click
    if (!product.isSoldOut) {
      onAddToCart?.(product.id);
      console.log(`Added product ${product.id} to cart`);
    }
  }, [product.id, product.isSoldOut, onAddToCart]);

  /**
   * Navigate to product detail page
   * Uses useCallback to prevent unnecessary re-renders
   */
  const handleCardClick = useCallback(() => {
    onViewProduct?.(product.id);
    console.log(`Viewing product ${product.id} details`);
  }, [product.id, onViewProduct]);

  /**
   * Handle wishlist click with event propagation prevention
   * Prevents triggering card click when wishlist button is clicked
   */
  const handleWishlistClickWithStop = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleWishlistClick();
  }, [handleWishlistClick]);

  /**
   * Handle mouse enter for hover effects
   * Uses useCallback to prevent function recreation on each render
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  /**
   * Handle mouse leave for hover effects
   * Uses useCallback to prevent function recreation on each render
   */
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // List view layout - horizontal product card
  if (viewMode === "list") {
    return (
      <Card 
        className={`group relative overflow-hidden transition-all duration-300 bg-white rounded-2xl cursor-pointer transform ${
          // No default border - border only appears on hover as requested
          isHovered 
            ? 'shadow-xl scale-[1.02] -translate-y-1 border border-gray-200' 
            : 'shadow-sm hover:shadow-lg border border-transparent'
        }`}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardContent className="p-0">
          <div className="flex gap-6 p-6">
            {/* Image Container - Optimized for list view */}
            <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                width={128}
                height={96}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Product status badges - positioned in top-left corner */}
              <div className="absolute top-1 left-1 flex flex-col gap-1">
                {product.isSale && product.salePercentage && (
                  <Badge className="bg-red-500 text-white px-2 py-1 rounded-full text-xs border-0 shadow-sm">
                    {product.salePercentage}% OFF
                  </Badge>
                )}
                {product.isSoldOut && (
                  <Badge className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs border-0 shadow-sm">
                    Sold Out
                  </Badge>
                )}
                {product.isNew && !product.isSale && !product.isSoldOut && (
                  <Badge className="bg-green-500 text-white px-2 py-1 rounded-full text-xs border-0 shadow-sm">
                    NEW
                  </Badge>
                )}
              </div>
            </div>

            {/* Product content section */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Product title and wishlist button */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-lg text-gray-800 pr-4 line-clamp-2">{product.name}</h3>
                  <Button
                    onClick={handleWishlistClickWithStop}
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 rounded-full bg-gray-50 hover:bg-gray-100 border-0 transition-all duration-200 flex-shrink-0 ${
                      isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                
                {/* Product description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  High-quality product with excellent features and durability.
                </p>
                
                {/* Rating display with accessible star rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex" aria-label={`Rating: ${product.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviewCount})</span>
                </div>
              </div>

              {/* Price and cart actions section */}
              <div className="flex items-center justify-between">
                {/* Price display with original price if discounted */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>
                
                {/* Add to cart button - only show if not sold out */}
                {!product.isSoldOut && (
                  <Button
                    onClick={handleAddToCart}
                    className={`h-10 w-10 p-0 rounded-full bg-teal-500 hover:bg-teal-600 text-white border-0 transition-all duration-200 ${
                      isHovered ? 'scale-110 shadow-lg' : 'shadow-md'
                    }`}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view layout - vertical product card (default)
  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-300 bg-white rounded-2xl cursor-pointer transform ${
        // No default border - border only appears on hover as requested
        isHovered 
          ? 'shadow-xl scale-[1.03] -translate-y-2 border border-gray-200' 
          : 'shadow-sm hover:shadow-lg border border-transparent'
      }`}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-0">
        {/* Image Container - Optimized aspect ratio for grid view */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            width={300}
            height={225}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Product status badges - positioned in top-left corner */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isSale && product.salePercentage && (
              <Badge className="bg-red-500 text-white px-2 py-1 rounded-full text-xs border-0 shadow-sm">
                {product.salePercentage}% OFF
              </Badge>
            )}
            {product.isSoldOut && (
              <Badge className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs border-0 shadow-sm">
                Sold Out
              </Badge>
            )}
            {product.isNew && !product.isSale && !product.isSoldOut && (
              <Badge className="bg-green-500 text-white px-2 py-1 rounded-full text-xs border-0 shadow-sm">
                NEW
              </Badge>
            )}
          </div>

          {/* Wishlist button - positioned in top-right corner */}
          <div className="absolute top-2 right-2">
            <Button
              onClick={handleWishlistClickWithStop}
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white border-0 shadow-sm transition-all duration-200 ${
                isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Product information section */}
        <div className="p-4 relative">
          {/* Product title */}
          <h3 className="font-medium mb-2 text-gray-800 line-clamp-2" title={product.name}>
            {product.name}
          </h3>
          
          {/* Product description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            High-quality product with excellent features and durability.
          </p>
          
          {/* Rating and reviews section */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex" aria-label={`Rating: ${product.rating} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>

          {/* Price and cart button container */}
          <div className="flex items-end justify-between">
            {/* Price display section */}
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            
            {/* Add to cart button - prominent circular placement */}
            {!product.isSoldOut && (
              <Button
                onClick={handleAddToCart}
                className={`h-12 w-12 p-0 rounded-full bg-teal-500 hover:bg-teal-600 text-white border-0 transition-all duration-200 ${
                  isHovered ? 'scale-110 shadow-xl' : 'shadow-lg'
                }`}
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}