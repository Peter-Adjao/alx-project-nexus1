/**
 * Header Component - Responsive navigation for TableTop e-commerce
 * Features:
 * - Desktop: Full navigation with dropdowns
 * - Mobile: Hamburger menu with scrollable categories
 * - Horizontal category tabs below header on small screens
 * - Responsive search bar optimization
 */

import { useState, useCallback, useMemo } from "react";
import { 
  Search, 
  ShoppingCart, 
  Grid3X3, 
  List, 
  Heart, 
  ChevronDown, 
  Package, 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageCircle,
  Menu,
  X,
  User
} from "lucide-react";
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
import Image from 'next/image';

// Define proper TypeScript interfaces for component props
interface HeaderProps {
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
  user?: { id: string; name: string; email: string; avatar?: string } | null;
  onCategorySelect?: (category: string) => void;
}

// Category interface for type safety
interface Category {
  name: string;
  value: string;
  subcategories: { name: string; value: string; }[];
}

// Support option interface
interface SupportOption {
  icon: any;
  label: string;
  action: () => void;
}

export function Header({ 
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
  user,
  onCategorySelect
}: HeaderProps) {
  // Local state management with proper typing
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Get wishlist count from context (prevents unnecessary re-renders)
  const { wishlistCount } = useWishlist();

  /**
   * Handle search input changes
   * Uses useCallback to prevent unnecessary re-renders
   * Debouncing could be added here for better performance
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  }, [onSearch]);

  /**
   * Toggle mobile menu visibility
   * Uses useCallback to prevent function recreation on each render
   */
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  /**
   * Handle navigation and close mobile menu
   * Prevents navigation issues on mobile
   */
  const handleNavigation = useCallback((page: string) => {
    onNavigate?.(page);
    setMobileMenuOpen(false); // Always close mobile menu after navigation
  }, [onNavigate]);

  /**
   * Handle authentication clicks
   * Closes mobile menu after authentication action
   */
  const handleAuthClick = useCallback((authType: "signin" | "signup" | "profile") => {
    onAuthClick?.(authType);
    setMobileMenuOpen(false);
  }, [onAuthClick]);

  /**
   * Handle category selection
   * Closes mobile menu and calls parent callback
   */
  const handleCategorySelect = useCallback((category: string) => {
    onCategorySelect?.(category);
    setMobileMenuOpen(false); // Close mobile menu after category selection
  }, [onCategorySelect]);

  // Memoized categories data to prevent unnecessary recalculations
  // Maps display names to actual API category values
  const categories = useMemo<Category[]>(() => [
    { 
      name: "Electronics", 
      value: "electronics",
      subcategories: [
        { name: "All Electronics", value: "electronics" },
        { name: "Smartphones", value: "electronics" },
        { name: "Laptops", value: "electronics" },
        { name: "Cameras", value: "electronics" }
      ] 
    },
    { 
      name: "Men's Fashion", 
      value: "men's clothing",
      subcategories: [
        { name: "All Men's Clothing", value: "men's clothing" },
        { name: "Shirts", value: "men's clothing" },
        { name: "Pants", value: "men's clothing" },
        { name: "Jackets", value: "men's clothing" }
      ] 
    },
    { 
      name: "Women's Fashion", 
      value: "women's clothing",
      subcategories: [
        { name: "All Women's Clothing", value: "women's clothing" },
        { name: "Dresses", value: "women's clothing" },
        { name: "Tops", value: "women's clothing" },
        { name: "Accessories", value: "women's clothing" }
      ] 
    },
    { 
      name: "Jewelry", 
      value: "jewelery",
      subcategories: [
        { name: "All Jewelry", value: "jewelery" },
        { name: "Necklaces", value: "jewelery" },
        { name: "Rings", value: "jewelery" },
        { name: "Earrings", value: "jewelery" }
      ] 
    },
  ], []);

  // Memoized support options to prevent recreation
  const supportOptions = useMemo<SupportOption[]>(() => [
    { icon: MessageCircle, label: "Live Chat", action: () => {} },
    { icon: Phone, label: "Call Us", action: () => {} },
    { icon: Mail, label: "Email Support", action: () => {} },
    { icon: HelpCircle, label: "Help Center", action: () => handleNavigation("support") },
  ], [handleNavigation]);

  return (
    <div className="bg-white/10 backdrop-blur-sm">
      <PromoBanner />
      
      <header className="px-4 sm:px-6 py-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between">
          {/* Left Section: Logo + Desktop Navigation */}
          <div className="flex items-center gap-8">
            {/* TableTop Brand Logo */}
            

            
            <div className="flex items-center">
              <div className="h-14 w-16  rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                      src="/images/newlogo.png" // Path to your image
                      alt="table top logo"
                      width={18}             // Desired width in pixels
                      height={18} 
                      className="h-full w-full object-cover"           // Desired height in pixels
                    />
              </div>
              <span className="text-white text-xl font-semibold">TableTop</span>
          </div>

            

            {/* Desktop Navigation Menu (hidden on mobile/tablet) */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className="bg-transparent text-white hover:bg-white/20 data-[active]:bg-white/20 data-[state=open]:bg-white/20"
                    onClick={() => handleNavigation("products")}
                  >
                    Products
                  </NavigationMenuTrigger>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/20 data-[active]:bg-white/20 data-[state=open]:bg-white/20">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="z-[9999] relative">
                    <div className="grid w-[600px] grid-cols-2 gap-3 p-6 bg-white shadow-2xl border rounded-lg">
                      {categories.map((category) => (
                        <div key={category.name} className="space-y-3">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                              <span className="text-sm text-teal-600 font-medium">
                                {category.name[0]}
                              </span>
                            </div>
                            <h4 
                              className="font-medium cursor-pointer hover:text-teal-600 transition-colors"
                              onClick={() => handleCategorySelect(category.value)}
                            >
                              {category.name}
                            </h4>
                          </div>
                          <ul className="space-y-2 ml-12">
                            {category.subcategories.map((sub) => (
                              <li key={sub.name}>
                                <NavigationMenuLink 
                                  className="text-sm text-muted-foreground hover:text-teal-600 cursor-pointer block py-1 transition-colors"
                                  onClick={() => handleCategorySelect(sub.value)}
                                >
                                  {sub.name}
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
                    <DropdownMenuContent align="start" className="w-48 z-[9999] bg-white shadow-lg border">
                      {supportOptions.map((option, index) => (
                        <DropdownMenuItem key={index} onClick={option.action} className="gap-2 hover:bg-gray-50">
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

          {/* Center Section: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search TableTop Catalogue" 
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-12 pr-4 py-3 bg-white border-0 rounded-full shadow-sm h-12 w-full text-base placeholder:text-gray-400 focus:ring-2 focus:ring-white/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Results Count */}
            <span className="hidden lg:block text-white text-sm whitespace-nowrap">
              {resultsCount} Results
            </span>

            {/* Desktop View Toggle */}
            <div className="hidden md:flex bg-white rounded-lg overflow-hidden">
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

            {/* Always Visible Actions: Wishlist, Cart, User, Profile Avatar */}
            {/* Wishlist Button */}
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

            {/* Shopping Cart Button */}
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

            {/* User Profile Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onProfileClick}
              className="text-white hover:bg-white/20 h-10 w-10 p-0"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Profile Avatar (always visible, triggers sidebar) */}
            <Avatar 
              className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-white/30 transition-all"
              onClick={onProfileClick}
            >
              <AvatarImage src={user?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"} />
              <AvatarFallback>{user?.name?.[0] || "AJ"}</AvatarFallback>
            </Avatar>

            {/* Desktop Authentication */}
            <div className="hidden lg:flex">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/20 gap-2">
                      <span className="hidden xl:inline">{user.name}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 z-[9999]">
                    <DropdownMenuItem onClick={() => handleAuthClick("profile")}>
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation("orders")}>
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigation("settings")}>
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
                    onClick={() => handleAuthClick("signin")}
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-white text-teal-600 hover:bg-gray-100"
                    onClick={() => handleAuthClick("signup")}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button (Only visible on medium and small screens) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="lg:hidden text-white hover:bg-white/20 h-10 w-10 p-0"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar (Below header on small screens) */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search TableTop" 
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-12 pr-4 py-3 bg-white border-0 rounded-full shadow-sm h-12 w-full text-base placeholder:text-gray-400 focus:ring-2 focus:ring-white/30 focus:outline-none"
            />
          </div>
        </div>
      </header>

      {/* Horizontal Category Tabs (Small Screens Only) - Scrollable */}
      <div className="lg:hidden border-t border-white/20 bg-white/5">
        <div className="px-4 py-3">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handleCategorySelect("")}
              className="whitespace-nowrap text-white/90 hover:text-white transition-colors text-sm font-medium pb-1 border-b-2 border-transparent hover:border-white/50 flex-shrink-0"
            >
              Explore our Products
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategorySelect(category.value)}
                className="whitespace-nowrap text-white/90 hover:text-white transition-colors text-sm font-medium pb-1 border-b-2 border-transparent hover:border-white/50 flex-shrink-0"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Background overlay */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={toggleMobileMenu}
          />
          
          {/* Menu panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
            
            {/* Menu header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-teal-400 to-blue-500">
              <h2 className="text-lg font-semibold text-white">TableTop Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Menu content */}
            <div className="p-4 space-y-6">
              
              {/* Categories section */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Categories</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => handleCategorySelect("")}
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-colors"
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleCategorySelect(category.value)}
                      className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-colors"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Support section */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Support</h3>
                <button
                  onClick={() => handleNavigation("support")}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-colors"
                >
                  Help & Support
                </button>
              </div>

              {/* View toggle section */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">View Options</h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <Button
                    size="sm"
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    onClick={() => {
                      onViewModeChange?.("grid");
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1"
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    onClick={() => {
                      onViewModeChange?.("list");
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1"
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>

              {/* Authentication section */}
              <div className="border-t pt-4">
                {!user ? (
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleAuthClick("signin")}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => handleAuthClick("signup")}
                      variant="outline"
                      className="w-full"
                    >
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="font-medium text-gray-800">Welcome back!</p>
                      <p className="text-sm text-gray-600">{user.name}</p>
                    </div>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleNavigation("orders")}
                      >
                        My Orders
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleNavigation("settings")}
                      >
                        Settings
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-red-600 hover:bg-red-50"
                        onClick={toggleMobileMenu}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}