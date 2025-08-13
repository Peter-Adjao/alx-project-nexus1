import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { SortDropdown, SortOption } from "./SortDropdown";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { apiService, Product as APIProduct } from "../lib/api";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  description: string;
  isNew?: boolean;
  isSale?: boolean;
  salePercentage?: number;
  isSoldOut?: boolean;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  minRating: number;
}

interface ProductCatalogueProps {
  searchQuery?: string;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  cartItemsCount?: number;
  sidebarOpen?: boolean;
  onNavigateToProduct?: (productId: string) => void;
  selectedCategory?: string;
  onUpdateCartCount?: (count: number) => void;
}

const PRODUCTS_PER_PAGE = {
  large: 5,
  medium: 3,
  small: 1
};

export function ProductCatalogue({ 
  searchQuery = "", 
  viewMode = "grid",
  onViewModeChange,
  cartItemsCount = 0,
  sidebarOpen = false,
  onNavigateToProduct,
  selectedCategory = "",
  onUpdateCartCount
}: ProductCatalogueProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    minRating: 0,
  });
  
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  // Initial display of 16 products as requested
  const [visibleProducts, setVisibleProducts] = useState(16);
  const [screenSize, setScreenSize] = useState<'small' | 'medium' | 'large'>('large');

  // Convert API product to our Product interface
  const convertAPIProduct = (apiProduct: APIProduct): Product => ({
    id: apiProduct.id.toString(),
    name: apiProduct.title,
    price: apiProduct.price,
    originalPrice: Math.random() > 0.6 ? apiProduct.price * 1.5 : undefined,
    rating: apiProduct.rating.rate,
    reviewCount: apiProduct.rating.count,
    image: apiProduct.image,
    category: apiProduct.category,
    description: apiProduct.description,
    isNew: Math.random() > 0.8,
    isSale: Math.random() > 0.7,
    salePercentage: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : undefined,
    isSoldOut: Math.random() > 0.95
  });

  // Screen size detection
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('small');
      } else if (width < 1024) {
        setScreenSize('medium');
      } else {
        setScreenSize('large');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const apiProducts = await apiService.getProducts();
        const convertedProducts = apiProducts.map(convertAPIProduct);
        setProducts(convertedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /**
   * Filter and sort products based on search, category, filters, and sort options
   * This memo ensures the filtering/sorting only recalculates when dependencies change
   */
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply category filter first (from header navigation)
    if (selectedCategory) {
      result = result.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      console.log(`Filtered by category "${selectedCategory}": ${result.length} products`);
    }

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply additional filters from filter panel
    if (filters.categories.length > 0) {
      result = result.filter(product => filters.categories.includes(product.category));
    }

    // Apply price range filter
    result = result.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply minimum rating filter
    if (filters.minRating > 0) {
      result = result.filter(product => product.rating >= filters.minRating);
    }

    // Apply sorting based on selected sort option
    switch (sortBy) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // relevance - maintains original API order
        break;
    }

    return result;
  }, [filters, sortBy, searchQuery, products, selectedCategory]);

  /**
   * Handle adding a product to the cart
   * Updates the cart count and shows success notification
   */
  const handleAddToCart = (productId: string) => {
    toast.success("Product added to cart!");
    // Update cart count if callback is provided
    if (onUpdateCartCount) {
      onUpdateCartCount(cartItemsCount + 1);
    }
    console.log(`Product ${productId} added to cart`);
  };

  /**
   * Load more products based on screen size
   * Responsive pagination that shows different amounts based on device
   */
  const handleLoadMore = () => {
    const increment = PRODUCTS_PER_PAGE[screenSize];
    setVisibleProducts(prev => prev + increment);
    console.log(`Loading ${increment} more products. Total visible: ${visibleProducts + increment}`);
  };

  const displayedProducts = filteredAndSortedProducts.slice(0, visibleProducts);
  const hasMoreProducts = visibleProducts < filteredAndSortedProducts.length;

  // Get grid columns based on view mode and screen size
  const getGridClasses = () => {
    if (viewMode === "list") {
      return "grid grid-cols-1 gap-4";
    }
    
    if (sidebarOpen) {
      return "grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
    return "grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl p-6 min-h-[calc(100vh-12rem)]">
          <div className={getGridClasses()}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Product Grid with White Background */}
      <div className="bg-white rounded-2xl p-6 min-h-[calc(100vh-12rem)]">
        <div className="w-full">
          {/* Products Grid */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={() => setFilters({
                  categories: [],
                  priceRange: [0, 1000],
                  minRating: 0,
                })} 
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className={getGridClasses()}>
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewProduct={onNavigateToProduct}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* View More Button */}
              {hasMoreProducts && (
                <div className="flex justify-center mt-12">
                  <Button 
                    onClick={handleLoadMore}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    View More Products
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* No Product Recommendations on main products page */}
    </div>
  );
}