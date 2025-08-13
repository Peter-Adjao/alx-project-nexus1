import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useRef } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  salePercentage?: number;
  isSoldOut?: boolean;
}

interface FeaturedCarouselProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
  onWishlistToggle?: (productId: string) => void;
}

export function FeaturedCarousel({ products, onAddToCart, onWishlistToggle }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-6">
      <div className="relative">
        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-600 h-10 w-10 p-0 rounded-full shadow-lg"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-600 h-10 w-10 p-0 rounded-full shadow-lg"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Products Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.slice(0, 6).map((product) => (
            <div 
              key={product.id} 
              className="flex-shrink-0 w-80"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onWishlistToggle={onWishlistToggle}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}