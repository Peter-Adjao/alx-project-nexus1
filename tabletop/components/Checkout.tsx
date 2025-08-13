import { useState } from "react";
import { ChevronRight, Check, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./fallback/ImageWithFallback";
import { ProductRecommendations } from "./ProductRecommendations";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutProps {
  cartItems?: CartItem[];
  onOrderComplete?: (orderData: any) => void;
  onBack?: () => void;
  onProceedToPayment?: () => void;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  state: string;
  zip: string;
  saveForNextTime: boolean;
  sameAsBilling: boolean;
}

// Default cart items for demo purposes
const defaultCartItems: CartItem[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
  },
  {
    id: "2", 
    name: "Smart Fitness Watch",
    price: 199.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
  },
  {
    id: "3",
    name: "Portable Phone Charger",
    price: 29.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1609592094027-aa86aea1b6ca?w=300&h=300&fit=crop"
  }
];

export function Checkout({ cartItems = defaultCartItems, onOrderComplete, onBack, onProceedToPayment }: CheckoutProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    country: '',
    state: '',
    zip: '',
    saveForNextTime: false,
    sameAsBilling: false,
  });

  // Validation functions
  const isStep1Valid = () => {
    return shippingAddress.firstName.trim() !== '' &&
           shippingAddress.lastName.trim() !== '' &&
           shippingAddress.addressLine1.trim() !== '' &&
           shippingAddress.country !== '' &&
           shippingAddress.state !== '' &&
           shippingAddress.zip.trim() !== '';
  };

  const isStep2Valid = () => {
    // For demo purposes, step 2 is always considered valid
    // In a real app, this would validate payment method selection
    return true;
  };

  const steps = [
    { id: 1, title: 'Shipping address', completed: currentStep > 1 },
    { id: 2, title: 'Payment Details', completed: currentStep > 2 },
    { id: 3, title: 'Review your order', completed: false },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.46;
  const total = subtotal + shipping;

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1 && !isStep1Valid()) {
      return; // Don't proceed if validation fails
    }
    if (currentStep === 2 && !isStep2Valid()) {
      return; // Don't proceed if validation fails
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      // Complete order - redirect to payment
      onProceedToPayment?.();
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToCart = () => {
    onBack?.();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBackToCart}
          className="mb-4 text-white hover:text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : currentStep === step.id
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {step.completed ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={`ml-2 text-sm ${
                    currentStep === step.id ? 'text-teal-600 font-medium' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-4" />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Shipping address</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                      className={`mt-1 ${!shippingAddress.firstName.trim() ? 'border-red-200 focus:border-red-400' : ''}`}
                      placeholder="Enter your first name"
                      required
                    />
                    {!shippingAddress.firstName.trim() && (
                      <p className="text-xs text-red-500 mt-1">First name is required</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                      className={`mt-1 ${!shippingAddress.lastName.trim() ? 'border-red-200 focus:border-red-400' : ''}`}
                      placeholder="Enter your last name"
                      required
                    />
                    {!shippingAddress.lastName.trim() && (
                      <p className="text-xs text-red-500 mt-1">Last name is required</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({...shippingAddress, addressLine1: e.target.value})}
                    className={`mt-1 ${!shippingAddress.addressLine1.trim() ? 'border-red-200 focus:border-red-400' : ''}`}
                    placeholder="Street address, P.O. box"
                    required
                  />
                  {!shippingAddress.addressLine1.trim() && (
                    <p className="text-xs text-red-500 mt-1">Address is required</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={(e) => setShippingAddress({...shippingAddress, addressLine2: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select value={shippingAddress.country} onValueChange={(value) => setShippingAddress({...shippingAddress, country: value})}>
                      <SelectTrigger className={`mt-1 ${!shippingAddress.country ? 'border-red-200' : ''}`}>
                        <SelectValue placeholder="Choose country..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ml">Mali</SelectItem>
                        <SelectItem value="tg">Togo</SelectItem>
                        <SelectItem value="gh">Ghana</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                      </SelectContent>
                    </Select>
                    {!shippingAddress.country && (
                      <p className="text-xs text-red-500 mt-1">Country is required</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={shippingAddress.state} onValueChange={(value) => setShippingAddress({...shippingAddress, state: value})}>
                      <SelectTrigger className={`mt-1 ${!shippingAddress.state ? 'border-red-200' : ''}`}>
                        <SelectValue placeholder="Choose state..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                        <SelectItem value="fl">Florida</SelectItem>
                        <SelectItem value="il">Illinois</SelectItem>
                        <SelectItem value="pa">Pennsylvania</SelectItem>
                      </SelectContent>
                    </Select>
                    {!shippingAddress.state && (
                      <p className="text-xs text-red-500 mt-1">State is required</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP *</Label>
                    <Input
                      id="zip"
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress({...shippingAddress, zip: e.target.value})}
                      className={`mt-1 ${!shippingAddress.zip.trim() ? 'border-red-200 focus:border-red-400' : ''}`}
                      placeholder="12345"
                      required
                    />
                    {!shippingAddress.zip.trim() && (
                      <p className="text-xs text-red-500 mt-1">ZIP code is required</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsBilling"
                      checked={shippingAddress.sameAsBilling}
                      onCheckedChange={(checked) => setShippingAddress({...shippingAddress, sameAsBilling: checked as boolean})}
                    />
                    <Label htmlFor="sameAsBilling" className="text-sm">
                      Shipping address is same as my billing address
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveForNextTime"
                      checked={shippingAddress.saveForNextTime}
                      onCheckedChange={(checked) => setShippingAddress({...shippingAddress, saveForNextTime: checked as boolean})}
                    />
                    <Label htmlFor="saveForNextTime" className="text-sm">
                      Save this information for next time
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Payment Details</h3>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Ready to proceed to secure payment</p>
                  <p className="text-sm text-gray-500">Click continue to proceed to payment processing</p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Review your order</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Shipping Address</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                    <p>{shippingAddress.addressLine1}</p>
                    {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                    <p>{shippingAddress.state}, {shippingAddress.zip}</p>
                    <p>{shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Previous
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!canProceedToNext()}
                className={`flex items-center gap-2 ${
                  canProceedToNext() 
                    ? 'bg-teal-500 hover:bg-teal-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                }`}
              >
                {currentStep === 3 ? 'Proceed to Payment' : 'NEXT'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-50 sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  🛒 Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-600">Quantity: {item.quantity} Item - USD {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg text-teal-600 pt-2 border-t">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="mt-12">
          <ProductRecommendations 
            title="Complete Your Order"
            limit={4}
          />
        </div>
      </div>
    </div>
  );
}