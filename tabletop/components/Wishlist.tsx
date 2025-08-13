import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useWishlist } from "./WishlistContext";
import { ImageWithFallback } from "./fallback/ImageWithFallback";

interface WishlistProps {
  onBack: () => void;
  onAddToCart: (item: any) => void;
}

export function Wishlist({ onBack, onAddToCart }: WishlistProps) {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();

  const handleAddToCart = (item: any) => {
    onAddToCart(item);
    removeFromWishlist(item.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl p-8 min-h-[calc(100vh-12rem)]">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">My Wishlist</h1>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Start browsing and add your favorite items to your wishlist. 
              They'll appear here for easy access later.
            </p>
            <Button onClick={onBack} className="bg-teal-500 hover:bg-teal-600">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl p-6 min-h-[calc(100vh-12rem)]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">My Wishlist</h1>
            <span className="text-gray-500">({wishlistItems.length} items)</span>
          </div>
          
          {wishlistItems.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearWishlist}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 hover:bg-white text-red-500 hover:text-red-600 rounded-full shadow-sm"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-sm line-clamp-2 leading-5">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <>
                        <span className="text-gray-500 line-through text-sm">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-green-600 text-sm font-medium">
                          {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-teal-500 hover:bg-teal-600 text-white gap-2"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-10 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}