import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { EnhancedProductCatalogue } from "./EnhancedProductCatalogue";
import { ProductDetail } from "./ProductDetail";
import { Checkout, CartItem } from "./Checkout";
import { DynamicInvoice, InvoiceData } from "./DynamicInvoice";
import { toast } from "sonner";

export function EnhancedApp() {
  const [activeView, setActiveView] = useState("product-catalogues");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);

  const handleNavigation = (item: string) => {
    setActiveView(item);
    setSelectedProductId(null);
    setCurrentInvoice(null);
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setActiveView("product-details");
  };

  const handleAddToCart = (productId: string, quantity: number) => {
    // Mock product data - in real app this would come from a store/context
    const product = {
      id: productId,
      name: "Premium Leather Handbag",
      price: 30,
      quantity,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
    };

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === productId);
      if (existingItem) {
        return prev.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, product];
    });

    toast.success(`Added ${quantity} item(s) to cart!`);
    
    // Navigate to checkout
    setActiveView("checkout-page");
  };

  const handleOrderComplete = (orderData: any) => {
    // Generate invoice data
    const invoiceData: InvoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      orderDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      status: 'paid',
      customer: {
        name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
        email: 'customer@example.com',
        address: {
          line1: orderData.shippingAddress.addressLine1,
          line2: orderData.shippingAddress.addressLine2,
          city: 'Sample City',
          state: orderData.shippingAddress.state,
          zip: orderData.shippingAddress.zip,
          country: orderData.shippingAddress.country,
        },
      },
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        description: 'Premium quality product',
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
        image: item.image,
      })),
      subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      tax: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08, // 8% tax
      taxRate: 8,
      shipping: 5.46,
      discount: 0,
      total: orderData.total + (cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08),
      paymentMethod: 'Credit Card',
      notes: 'Thank you for your purchase! Your order will be processed within 1-2 business days.',
    };

    setCurrentInvoice(invoiceData);
    setActiveView("dynamic-invoice");
    setCartItems([]);
    
    toast.success("Order completed successfully!");
  };

  const renderCurrentView = () => {
    switch (activeView) {
      case "product-catalogues":
        return <EnhancedProductCatalogue onProductSelect={handleProductSelect} />;
      
      case "product-details":
        return selectedProductId ? (
          <ProductDetail
            productId={selectedProductId}
            onAddToCart={handleAddToCart}
            onBack={() => setActiveView("product-catalogues")}
          />
        ) : (
          <EnhancedProductCatalogue onProductSelect={handleProductSelect} />
        );
      
      case "checkout-page":
        return (
          <Checkout
            cartItems={cartItems}
            onOrderComplete={handleOrderComplete}
          />
        );
      
      case "dynamic-invoice":
        return currentInvoice ? (
          <DynamicInvoice
            invoiceData={currentInvoice}
            onClose={() => setActiveView("product-catalogues")}
          />
        ) : (
          <div className="flex-1 bg-gradient-to-br from-teal-400 to-blue-500 p-6 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 text-center">
              <h2 className="text-xl font-medium text-gray-800 mb-4">No Invoice Available</h2>
              <p className="text-gray-600 mb-4">Complete an order to generate an invoice.</p>
              <button
                onClick={() => setActiveView("product-catalogues")}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
              >
                Browse Products
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex-1 bg-gradient-to-br from-teal-400 to-blue-500 p-6 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 text-center">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Coming Soon</h2>
              <p className="text-gray-600 mb-4">This section is under development.</p>
              <button
                onClick={() => setActiveView("product-catalogues")}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
              >
                Browse Products
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeItem={activeView} onNavigate={handleNavigation} />
      {renderCurrentView()}
    </div>
  );
}