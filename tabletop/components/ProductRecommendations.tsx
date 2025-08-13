'use client';

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useWishlist } from "./WishlistContext";
import { apiService, Product as APIProduct } from "../services/api";
import { toast } from "sonner";
import { ImageWithFallback } from "./fallback/ImageWithFallback";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
}

interface ProductRecommendationsProps {
  title?: string;
  excludeProductId?: string;
  limit?: number;
}

export function ProductRecommendations({ 
  title = "Recommended For You",
  excludeProductId,
  limit = 8
}: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const convertAPIProduct = (apiProduct: APIProduct): Product => ({
    id: apiProduct.id.toString(),
    name: apiProduct.title,
    price: apiProduct.price,
    originalPrice: Math.random() > 0.6 ? apiProduct.price * 1.2 : undefined,
    rating: apiProduct.rating.rate,
    reviewCount: apiProduct.rating.count,
    image: apiProduct.image,
    category: apiProduct.category,
  });

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const apiProducts = await apiService.getProducts(limit + 2); // Get a few extra to exclude current product
        let convertedProducts = apiProducts.map(convertAPIProduct);
        
        // Filter out the current product if provided
        if (excludeProductId) {
          convertedProducts = convertedProducts.filter(p => p.id !== excludeProductId);
        }
        
        setProducts(convertedProducts.slice(0, limit));
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [limit, excludeProductId]);

  const handleWishlistToggle = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const isWishlisted = isInWishlist(product.id);
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist({
        id: product.id,
        title: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image
      });
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Product added to cart!");
  };

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4
  };

  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return itemsPerView.mobile;
      if (window.innerWidth < 1024) return itemsPerView.tablet;
    }
    return itemsPerView.desktop;
  };

  const [itemsToShow, setItemsToShow] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => setItemsToShow(getItemsPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsToShow >= products.length ? 0 : prevIndex + itemsToShow
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, products.length - itemsToShow) : Math.max(0, prevIndex - itemsToShow)
    );
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl mb-6 text-gray-800">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="py-8" role="region" aria-label="Product recommendations">
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-gray-800">{title}</h2>
          
          {products.length > itemsToShow && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="h-8 w-8 p-0 rounded-full border-gray-200 hover:border-teal-300 hover:bg-teal-50"
                aria-label="Previous products"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentIndex + itemsToShow >= products.length}
                className="h-8 w-8 p-0 rounded-full border-gray-200 hover:border-teal-300 hover:bg-teal-50"
                aria-label="Next products"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product) => {
            const isWishlisted = isInWishlist(product.id);
            
            return (
              <Card 
                key={product.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 rounded-xl overflow-hidden"
                onClick={() => {
                  // Navigate to product detail would be implemented here
                  console.log('Navigate to product:', product.id);
                }}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Discount Badge */}
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-teal-500 text-white px-2 py-1 rounded-full text-xs">
                        SAVE ${(product.originalPrice - product.price).toFixed(0)}
                      </Badge>
                    )}
                    
                    {/* Wishlist Button */}
                    <Button
                      onClick={(e) => handleWishlistToggle(product, e)}
                      variant="ghost"
                      size="sm"
                      className={`absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white transition-all duration-200 ${
                        isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                      }`}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </Button>
                    
                    {/* Add to Cart Button */}
                    <Button
                      onClick={(e) => handleAddToCart(product.id, e)}
                      className="absolute bottom-2 right-2 h-10 w-10 p-0 rounded-full bg-teal-500 hover:bg-teal-600 text-white shadow-lg transition-all duration-200 hover:scale-110"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-sm text-gray-800 line-clamp-2 mb-2" title={product.name}>
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
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
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}