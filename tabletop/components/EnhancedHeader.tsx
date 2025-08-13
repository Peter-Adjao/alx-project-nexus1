
import { useState } from "react";
import { Search, ShoppingCart, Grid3X3, List, Heart, User, ChevronDown, Package, HelpCircle, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { PromoBanner } from "./PromoBanner";
import { useWishlist } from "./WishlistContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { motion } from "framer-motion";

interface EnhancedHeaderProps {
  cartItemsCount?: number;
  resultsCount?: number;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  onSearch?: (query: string) => void;
  onProfileClick?: () => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onNavigate?: (page: string) => void;
  onAuthClick?: (authType: "signin" | "signup" | "profile") => void;
  sidebarOpen?: boolean;
  user?: any;
}

export function EnhancedHeader({ 
  cartItemsCount = 0, 
  resultsCount = 11,
  viewMode = "grid",
  onViewModeChange,
  onSearch,
  onProfileClick,
  onCartClick,
  onWishlistClick,
  onNavigate,
  onAuthClick,
  sidebarOpen = false,
  user
}: EnhancedHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { wishlistCount } = useWishlist();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const categories = [
    { name: "Electronics", subcategories: ["Smartphones", "Laptops", "Headphones", "Cameras"] },
    { name: "Fashion", subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories"] },
    { name: "Beauty", subcategories: ["Skincare", "Makeup", "Fragrances", "Hair Care"] },
    { name: "Sports", subcategories: ["Fitness Equipment", "Athletic Wear", "Outdoor Gear", "Team Sports"] },
    { name: "Home & Garden", subcategories: ["Furniture", "Decor", "Kitchen", "Garden Tools"] },
  ];

  const supportOptions = [
    { icon: MessageCircle, label: "Live Chat", action: () => {} },
    { icon: Phone, label: "Call Us", action: () => {} },
    { icon: Mail, label: "Email Support", action: () => {} },
    { icon: HelpCircle, label: "Help Center", action: () => onNavigate?.("support") },
  ];

  return (
    <div>
      <PromoBanner />
      
      <header className="px-6 py-4 bg-white/10 backdrop-blur-sm">
        {/* Top Row - Brand Logo and Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-8">
            {/* Brand Logo */}
            <motion.div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onNavigate?.("products")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-white text-xl font-bold">ShopHub</span>
            </motion.div>

            {/* Navigation Menu */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className="bg-transparent text-white hover:bg-white/20 data-[active]:bg-white/20 data-[state=open]:bg-white/20"
                    onClick={() => onNavigate?.("products")}
                  >
                    Products
                  </NavigationMenuTrigger>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/20 data-[active]:bg-white/20 data-[state=open]:bg-white/20">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                      {categories.map((category) => (
                        <div key={category.name} className="space-y-2">
                          <h4 
                            className="text-sm font-medium cursor-pointer hover:text-teal-600 transition-colors"
                            onClick={() => onNavigate?.("categories")}
                          >
                            {category.name}
                          </h4>
                          <ul className="space-y-1">
                            {category.subcategories.map((sub) => (
                              <li key={sub}>
                                <NavigationMenuLink className="text-sm text-muted-foreground hover:text-teal-600 cursor-pointer">
                                  {sub}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white hover:bg-white/20 gap-1">
                        Support <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {supportOptions.map((option, index) => (
                        <DropdownMenuItem key={index} onClick={option.action} className="gap-2">
                          <option.icon className="h-4 w-4" />
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/20 gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.name}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onAuthClick?.("profile")}>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.("orders")}>
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate?.("settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={() => onAuthClick?.("signin")}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  className="bg-white text-teal-600 hover:bg-gray-100"
                  onClick={() => onAuthClick?.("signup")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row - Search and Actions */}
        <div className="flex items-center gap-6">
          {/* Profile Avatar - triggers sidebar */}
          <div className="flex-shrink-0">
            <Avatar 
              className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-white/30 transition-all"
              onClick={onProfileClick}
            >
              <AvatarImage src={user?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"} />
              <AvatarFallback>{user?.name?.[0] || "AJ"}</AvatarFallback>
            </Avatar>
          </div>

          {/* Title */}
          <div className="flex-shrink-0">
            <h1 className="text-white text-xl font-medium">Product Catalogues</h1>
          </div>

          {/* Search Bar - Centered and expanded */}
          <div className="flex-1 flex justify-center">
            <div className={`relative w-full ${sidebarOpen ? 'max-w-lg' : 'max-w-2xl'}`}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search Catalogue" 
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-12 pr-4 py-3 bg-white border-0 rounded-full shadow-sm h-12 w-full text-base placeholder:text-gray-400 focus:ring-2 focus:ring-white/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Results Count */}
            <span className="text-white text-sm font-medium whitespace-nowrap">
              {resultsCount} Results
            </span>

            {/* View Toggle - Grouped buttons */}
            <div className="flex bg-white rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewModeChange?.("grid")}
                className={`h-10 w-10 p-0 rounded-none border-0 ${
                  viewMode === "grid" 
                    ? "bg-gray-100 text-gray-700" 
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewModeChange?.("list")}
                className={`h-10 w-10 p-0 rounded-none border-0 ${
                  viewMode === "list" 
                    ? "bg-gray-100 text-gray-700" 
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onWishlistClick}
              className="text-white hover:bg-white/20 h-10 w-10 p-0 relative"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            {/* Shopping Cart */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCartClick}
              className="text-white hover:bg-white/20 h-10 w-10 p-0 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}