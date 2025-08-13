import { useState } from "react";
import { Search, Grid, List, ShoppingCart } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./fallback/ImageWithFallback";
import catalogueImage from 'figma:asset/40551492a6e5ca1f6c9e13119b9196a357370756.png';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  rating: number;
  image: string;
  discount?: number;
  soldOut?: boolean;
}

interface EnhancedProductCatalogueProps {
  onProductSelect: (productId: string) => void;
}

const products: Product[] = [
  {
    id: "1",
    name: "Premium Leather Handbag",
    price: 30,
    description: "lorem ipsum default text example lorem ipsum default text example lorem ipsum default text example.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
  },
  {
    id: "2", 
    name: "Classic Canvas Sneakers",
    price: 30,
    description: "lorem ipsum default text example lorem ipsum default text example lorem ipsum default text example.",
    rating: 2,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Organic Skincare Set",
    price: 15,
    description: "lorem ipsum default text example lorem ipsum default text example lorem ipsum default text example.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    discount: 90,
    soldOut: true,
  },
  {
    id: "4",
    name: "Smartphone Case",
    price: 25,
    description: "lorem ipsum default text example lorem ipsum default text example lorem ipsum default text example.",
    rating: 3,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop",
    discount: 90,
  },
  {
    id: "5",
    name: "Wireless Headphones",
    price: 45,
    description: "lorem ipsum default text example lorem ipsum default text example lorem ipsum default text example.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    soldOut: true,
  },
  {
    id: "6",
    name: "Smart Watch",
    price: 89,
    description: "lorem ipsum default text example lorem ipsum default text example lorem ipsum default text example.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    soldOut: true,
  },
];

export function EnhancedProductCatalogue({ onProductSelect }: EnhancedProductCatalogueProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-teal-400 to-blue-500 p-6">
      <div className="bg-white rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Product Catalogues</h1>
          
          {/* Search and Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search Catalogue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{filteredProducts.length} Results</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
              onClick={() => onProductSelect(product.id)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.discount && (
                      <Badge className="bg-orange-500 text-white">
                        Discount {product.discount}%
                      </Badge>
                    )}
                    {product.soldOut && (
                      <Badge className="bg-gray-500 text-white">
                        Sold out
                      </Badge>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 bg-teal-500 hover:bg-teal-600 text-white rounded-full w-10 h-10 p-0"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    {renderStars(product.rating)}
                  </div>
                  
                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-800">
                      $ {product.price}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-teal-600 border-teal-600 hover:bg-teal-50"
                    >
                      SEE DETAIL
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