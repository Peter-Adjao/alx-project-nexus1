import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowLeft, Star, Heart, ThumbsUp, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./fallback/ImageWithFallback";
import { ProductRecommendations } from "./ProductRecommendations";
import { useWishlist } from "./WishlistContext";
import { apiService, Product as APIProduct, Review } from "../services/api";
import { toast } from "sonner";

interface ProductDetailProps {
  productId?: string;
  onAddToCart?: (productId: string, quantity: number) => void;
  onBack?: () => void;
  onGoToCart?: () => void;
}

export function ProductDetail({ productId = "1", onAddToCart, onBack, onGoToCart }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<APIProduct | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const productData = await apiService.getProduct(parseInt(productId));
        if (productData) {
          setProduct(productData);
          setReviews(apiService.getProductReviews(productData.id));
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const isWishlisted = product ? isInWishlist(product.id.toString()) : false;

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isWishlisted) {
      removeFromWishlist(product.id.toString());
      toast.success("Removed from wishlist");
    } else {
      addToWishlist({
        id: product.id.toString(),
        title: product.title,
        price: product.price,
        image: product.image
      });
      toast.success("Added to wishlist");
    }
  };

  // Mock additional product images for carousel
  const getProductImages = () => {
    if (!product) return [];
    return [
      product.image,
      `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop`,
      `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop`,
    ];
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const nextImage = () => {
    const images = getProductImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getProductImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    if (!product) return;
    onAddToCart?.(product.id.toString(), quantity);
    setAddedToCart(true);
    toast.success("Product added to cart!");
  };

  const handleGoToCart = () => {
    onGoToCart?.();
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-teal-400 to-blue-500 p-6">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 bg-gradient-to-br from-teal-400 to-blue-500 p-6">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Product not found</p>
            {onBack && (
              <Button variant="outline" onClick={onBack} className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const images = getProductImages();

  return (
    <div className="flex-1 bg-gradient-to-br from-teal-400 to-blue-500 p-6">
      <div className="bg-white rounded-lg p-6">
        <div className="mb-6 flex items-center gap-4">
          {onBack && (
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <h1 className="text-2xl font-semibold text-gray-800">Product Details</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="space-y-4">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={images[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-96 object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={prevImage}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        onClick={nextImage}
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Wishlist Button */}
                  <Button
                    onClick={handleWishlistToggle}
                    variant="ghost"
                    size="sm"
                    className={`absolute top-3 right-3 h-10 w-10 p-0 rounded-full bg-white/90 hover:bg-white transition-all duration-200 ${
                      isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 justify-center">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === currentImageIndex ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`View image ${index + 1}`}
                      >
                        <ImageWithFallback
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{product.title}</h2>
                  <div className="text-3xl font-bold text-gray-800 mb-4">${product.price}</div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {renderStars(product.rating.rate)}
                    </div>
                    <span className="text-gray-600">({product.rating.count} reviews)</span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Category Badge */}
                  <Badge className="mb-6 bg-teal-100 text-teal-800 capitalize">
                    {product.category}
                  </Badge>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    {!addedToCart ? (
                      <Button 
                        onClick={handleAddToCart}
                        className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg flex items-center justify-center gap-2 text-lg font-medium"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        ADD TO CART
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={handleAddToCart}
                          variant="outline"
                          className="flex-1 border-teal-500 text-teal-500 hover:bg-teal-50 px-8 py-3 rounded-lg flex items-center justify-center gap-2 text-lg font-medium"
                        >
                          <ShoppingCart className="h-5 w-5" />
                          ADD MORE
                        </Button>
                        <Button 
                          onClick={handleGoToCart}
                          className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg flex items-center justify-center gap-2 text-lg font-medium"
                        >
                          <ShoppingBag className="h-5 w-5" />
                          GO TO CART
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews" className="relative">
              REVIEWS
              <Badge className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs">
                {reviews.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="description">DESCRIPTION</TabsTrigger>
            <TabsTrigger value="specification">SPECIFICATION</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://images.unsplash.com/photo-1${Math.random().toString().substr(2, 10)}?w=40&h=40&fit=crop&crop=face`} />
                          <AvatarFallback>{review.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{review.userName}</h4>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{review.comment}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                              Helpful ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="description" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium text-gray-800">Key Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>High-quality materials and construction</li>
                      <li>Durable and long-lasting design</li>
                      <li>Perfect for everyday use</li>
                      <li>Excellent value for money</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specification" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800 mb-4">Product Details</h4>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="text-gray-600 capitalize">{product.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="text-gray-600">${product.price}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-700">Rating:</span>
                      <span className="text-gray-600">{product.rating.rate}/5</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-700">Reviews:</span>
                      <span className="text-gray-600">{product.rating.count}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800 mb-4">Shipping & Returns</h4>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-700">Shipping:</span>
                      <span className="text-gray-600">Free shipping</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-700">Delivery:</span>
                      <span className="text-gray-600">3-5 business days</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-700">Returns:</span>
                      <span className="text-gray-600">30-day return policy</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-medium text-gray-700">Warranty:</span>
                      <span className="text-gray-600">1 year manufacturer warranty</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Recommendations */}
      <ProductRecommendations 
        title="You Might Also Like"
        excludeProductId={product.id.toString()}
        limit={4}
      />
    </div>
  );
}