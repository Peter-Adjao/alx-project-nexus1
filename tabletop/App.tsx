'use client';

/**
 * Main App Component for E-commerce Product Catalogue
 * This is the root component that manages application state and routing
 */

import { useState, useCallback } from "react";
import { Header } from "./components/Header";
import { ProductCatalogue } from "./components/ProductCatalogue";
import { Footer } from "./components/Footer";
import { EnhancedApp } from "./components/EnhancedApp";
import { AppSidebar } from "./components/AppSidebar";
import { ProductDetail } from "./components/ProductDetail";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { Payment } from "./components/Payment";
import { DynamicInvoice } from "./components/DynamicInvoice";
import { Wishlist } from "./components/Wishlist";
import { AuthPages } from "./components/AuthPages";
import { WishlistProvider } from "./components/WishlistContext";
import { ProductRecommendations } from "./components/ProductRecommendations";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";

// Define all possible pages in the application
export type Page = "home" | "products" | "categories" | "orders" | "profile" | "settings" | "product-detail" | "cart" | "checkout" | "payment" | "invoice" | "wishlist" | "support";

// Define user interface for authentication
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function App() {
  // Application version state - toggles between original and enhanced views
  const [currentVersion, setCurrentVersion] = useState<"original" | "enhanced">("original");
  
  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("");
  
  // View mode for product display (grid or list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Shopping cart state
  const [cartItemsCount, setCartItemsCount] = useState(3);
  
  // Sidebar visibility state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Current page routing state
  const [currentPage, setCurrentPage] = useState<Page>("products");
  
  // Authentication modal state
  const [currentAuth, setCurrentAuth] = useState<"signin" | "signup" | "profile" | null>(null);
  
  // User authentication state
  const [user, setUser] = useState<User | null>(null);
  
  // Currently selected product for detail view
  const [currentProductId, setCurrentProductId] = useState<string>("1");
  
  // Selected category for filtering products
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  /**
   * Clear cart after successful payment
   * This function is called when payment is completed
   * Uses useCallback to prevent unnecessary re-renders
   */
  const clearCart = useCallback(() => {
    setCartItemsCount(0);
    console.log("Cart cleared after successful payment");
  }, []);

  /**
   * Handle category selection from header navigation
   * Links categories to actual product filtering
   * Uses useCallback to prevent unnecessary re-renders and function recreation
   */
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage("products");
    console.log("Category selected:", category);
  }, []);

  /**
   * Render the appropriate page content based on current page state
   * This is the main routing logic for the application
   */
  const renderPageContent = () => {
    switch (currentPage) {
      case "home":
      case "products":
        return (
          <ProductCatalogue 
            searchQuery={searchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            cartItemsCount={cartItemsCount}
            sidebarOpen={sidebarOpen}
            onNavigateToProduct={(productId) => {
              setCurrentProductId(productId || "1");
              setCurrentPage("product-detail");
            }}
            selectedCategory={selectedCategory}
            onUpdateCartCount={setCartItemsCount}
          />
        );
      
      case "categories":
        return (
          <div className="p-6">
            <div className="bg-white rounded-2xl p-6 min-h-[calc(100vh-12rem)]">
              <h2 className="text-2xl font-bold mb-6">Categories</h2>
              <div className={`grid gap-6 ${
                sidebarOpen 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" 
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}>
                {/* Electronics Category */}
                <div 
                  className="p-6 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleCategorySelect("electronics")}
                >
                  <h3 className="text-lg font-semibold mb-2">Electronics</h3>
                  <p className="text-gray-600">Latest gadgets and devices</p>
                </div>
                
                {/* Fashion Category */}
                <div 
                  className="p-6 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleCategorySelect("men's clothing")}
                >
                  <h3 className="text-lg font-semibold mb-2">Fashion</h3>
                  <p className="text-gray-600">Clothing and accessories</p>
                </div>
                
                {/* Beauty Category */}
                <div 
                  className="p-6 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleCategorySelect("jewelery")}
                >
                  <h3 className="text-lg font-semibold mb-2">Beauty & Jewelry</h3>
                  <p className="text-gray-600">Skincare, cosmetics and jewelry</p>
                </div>
                
                {/* Women's Fashion Category */}
                <div 
                  className="p-6 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleCategorySelect("women's clothing")}
                >
                  <h3 className="text-lg font-semibold mb-2">Women's Fashion</h3>
                  <p className="text-gray-600">Women's clothing and accessories</p>
                </div>
              </div>
            </div>
            {/* Show product recommendations for all categories */}
            <ProductRecommendations title="Popular in All Categories" limit={8} />
          </div>
        );
      
      case "orders":
        return (
          <div className="p-6">
            <div className="bg-white rounded-2xl p-6 min-h-[calc(100vh-12rem)]">
              <h2 className="text-2xl font-bold mb-6">My Orders</h2>
              <div className="space-y-4">
                {/* Recent Order */}
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Order #12345</h3>
                      <p className="text-gray-600">Placed on {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Delivered</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage("invoice")}
                      >
                        View Invoice
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Previous Order */}
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Order #12344</h3>
                      <p className="text-gray-600">Placed on {new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "profile":
        return (
          <div className="p-6">
            <div className="bg-white rounded-2xl p-6 min-h-[calc(100vh-12rem)]">
              <h2 className="text-2xl font-bold mb-6">My Profile</h2>
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name || "Avril Jane"} 
                    className="w-full p-3 border rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email || "avril.jane@example.com"} 
                    className="w-full p-3 border rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input 
                    type="tel" 
                    defaultValue="+1 (555) 123-4567" 
                    className="w-full p-3 border rounded-lg" 
                  />
                </div>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white">Save Changes</Button>
              </div>
            </div>
          </div>
        );
      
      case "settings":
        return (
          <div className="p-6">
            <div className="bg-white rounded-2xl p-6 min-h-[calc(100vh-12rem)]">
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Email notifications</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Push notifications</span>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Account</h3>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "product-detail":
        return (
          <ProductDetail 
            productId={currentProductId}
            onBack={() => setCurrentPage("products")}
            onAddToCart={(productId, quantity) => {
              setCartItemsCount(prev => prev + quantity);
            }}
            onGoToCart={() => setCurrentPage("cart")}
          />
        );
      
      case "cart":
        return (
          <Cart 
            onBack={() => setCurrentPage("products")}
            onCheckout={() => setCurrentPage("checkout")}
            cartItemsCount={cartItemsCount}
            onUpdateCart={setCartItemsCount}
          />
        );
      
      case "checkout":
        return (
          <Checkout 
            onBack={() => setCurrentPage("cart")}
            onProceedToPayment={() => setCurrentPage("payment")}
          />
        );
      
      case "payment":
        return (
          <Payment 
            onBack={() => setCurrentPage("checkout")}
            onPaymentComplete={() => {
              // Clear cart after successful payment
              clearCart();
              setCurrentPage("invoice");
            }}
          />
        );
      
      case "invoice":
        return (
          <DynamicInvoice 
            onBack={() => setCurrentPage("orders")}
            onNewOrder={() => setCurrentPage("products")}
          />
        );
      
      case "wishlist":
        return (
          <Wishlist 
            onBack={() => setCurrentPage("products")}
            onAddToCart={() => {
              setCartItemsCount(prev => prev + 1);
            }}
          />
        );
      
      case "support":
        return (
          <div className="p-6">
            <div className="bg-white rounded-2xl p-6 min-h-[calc(100vh-12rem)]">
              <h2 className="text-2xl font-bold mb-6">Support & Help Center</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Support options grid */}
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                  <p className="text-gray-600 mb-4">Get instant help from our support team</p>
                  <Button className="bg-teal-500 hover:bg-teal-600">Start Chat</Button>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">FAQ</h3>
                  <p className="text-gray-600 mb-4">Find answers to common questions</p>
                  <Button variant="outline">View FAQ</Button>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                  <p className="text-gray-600 mb-4">Reach out via email or phone</p>
                  <Button variant="outline">Get In Touch</Button>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Returns & Refunds</h3>
                  <p className="text-gray-600 mb-4">Learn about our return policy</p>
                  <Button variant="outline">View Policy</Button>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Shipping Info</h3>
                  <p className="text-gray-600 mb-4">Track orders and delivery options</p>
                  <Button variant="outline">Track Order</Button>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Account Help</h3>
                  <p className="text-gray-600 mb-4">Manage your account settings</p>
                  <Button variant="outline">Account Settings</Button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <ProductCatalogue 
            searchQuery={searchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            cartItemsCount={cartItemsCount}
            sidebarOpen={sidebarOpen}
            onNavigateToProduct={(productId) => {
              setCurrentProductId(productId || "1");
              setCurrentPage("product-detail");
            }}
            selectedCategory={selectedCategory}
            onUpdateCartCount={setCartItemsCount}
          />
        );
    }
  };

  // Enhanced version of the app
  if (currentVersion === "enhanced") {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setCurrentVersion("original")}
            variant="outline"
            className="bg-white/90 backdrop-blur"
          >
            Switch to Original Version
          </Button>
        </div>
        <EnhancedApp />
        <Toaster />
      </div>
    );
  }

  // Main application render
  return (
    <WishlistProvider>
      <div className="min-h-screen bg-background">
        {/* Version toggle button */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setCurrentVersion("enhanced")}
            variant="outline"
            className="bg-white/90 backdrop-blur"
          >
            Switch to Enhanced Version
          </Button>
        </div>
        
        {/* Sidebar component */}
        <AppSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onNavigate={setCurrentPage}
          onProfileClick={() => setSidebarOpen(!sidebarOpen)}
          onAuthClick={(authType) => setCurrentAuth(authType)}
          user={user}
          onLogout={() => setUser(null)}
        />
        
        {/* Main content area with responsive sidebar margin */}
        <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : ''}`}>
          <div className="bg-gradient-to-r from-teal-400 to-blue-500 min-h-screen">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40">
              <Header 
                cartItemsCount={cartItemsCount}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onSearch={setSearchQuery}
                onProfileClick={() => setSidebarOpen(!sidebarOpen)}
                onCartClick={() => setCurrentPage("cart")}
                onWishlistClick={() => setCurrentPage("wishlist")}
                onNavigate={(page) => setCurrentPage(page as Page)}
                onAuthClick={(authType) => setCurrentAuth(authType)}
                resultsCount={6}
                sidebarOpen={sidebarOpen}
                user={user}
                onCategorySelect={handleCategorySelect}
              />
            </div>
            
            {/* Main page content */}
            <main>
              {renderPageContent()}
            </main>
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
        
        {/* Authentication modal */}
        <AuthPages 
          currentAuth={currentAuth}
          onClose={() => setCurrentAuth(null)}
          onAuthSuccess={(userData) => {
            setUser(userData);
            setCurrentAuth(null);
          }}
        />
        
        {/* Toast notifications */}
        <Toaster />
      </div>
    </WishlistProvider>
  );
}