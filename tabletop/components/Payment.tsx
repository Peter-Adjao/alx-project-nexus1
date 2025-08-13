import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, CreditCard, Lock, Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface PaymentProps {
  onBack: () => void;
  onPaymentComplete: () => void;
}

export function Payment({ onBack, onPaymentComplete }: PaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    email: "new.customer@example.com",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Ghana"
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("billing.")) {
      const billingField = field.replace("billing.", "");
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [billingField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      handleInputChange("cardNumber", formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      handleInputChange("expiryDate", formatted);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success("Payment successful! Redirecting to invoice...");
    
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 1000);
  };

  const orderTotal = 317.97; // This would come from props in a real app

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 text-white hover:text-white hover:bg-white/20"
          disabled={isProcessing}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Checkout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                Your payment information is secure and encrypted
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <Label className="text-base font-medium">Payment Method</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      paymentMethod === "card" 
                        ? "border-teal-500 bg-teal-50 text-teal-700" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paystack")}
                    className={`p-3 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      paymentMethod === "paystack" 
                        ? "border-teal-500 bg-teal-50 text-teal-700" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-4 h-4 bg-teal-500 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    Paystack
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`p-3 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      paymentMethod === "paypal" 
                        ? "border-teal-500 bg-teal-50 text-teal-700" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    PayPal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("apple")}
                    className={`p-3 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      paymentMethod === "apple" 
                        ? "border-teal-500 bg-teal-50 text-teal-700" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Apple Pay
                  </button>
                </div>
              </div>

              {paymentMethod === "card" && (
                <>
                  {/* Card Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleExpiryChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => {
                            if (e.target.value.length <= 4) {
                              handleInputChange("cvv", e.target.value.replace(/\D/g, ''));
                            }
                          }}
                          className="mt-1"
                        />
                      </div>
                      <div></div>
                    </div>

                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        placeholder="John Doe"
                        value={formData.cardholderName}
                        onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Billing Address</h3>
                    
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        placeholder="123 Main Street"
                        value={formData.billingAddress.street}
                        onChange={(e) => handleInputChange("billing.street", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.billingAddress.city}
                          onChange={(e) => handleInputChange("billing.city", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Select onValueChange={(value) => handleInputChange("billing.state", value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NG">Nigeria</SelectItem>
                            <SelectItem value="TG">Togo</SelectItem>
                            <SelectItem value="GH">Ghana</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={formData.billingAddress.zipCode}
                          onChange={(e) => handleInputChange("billing.zipCode", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select onValueChange={(value) => handleInputChange("billing.country", value)} defaultValue="US">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NG">Nigeria</SelectItem>
                            <SelectItem value="TG">Togo</SelectItem>
                            <SelectItem value="GH">Ghana</SelectItem>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "paypal" && (
                <div className="text-center py-8">
                  <div className="text-blue-600 text-2xl font-bold mb-4">PayPal</div>
                  <p className="text-gray-600 mb-6">You will be redirected to PayPal to complete your payment.</p>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Continue with PayPal
                  </Button>
                </div>
              )}

              {paymentMethod === "apple" && (
                <div className="text-center py-8">
                  <div className="text-black text-2xl font-bold mb-4">Apple Pay</div>
                  <p className="text-gray-600 mb-6">Use Touch ID or Face ID to pay with Apple Pay.</p>
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    Pay with Apple Pay
                  </Button>
                </div>
              )}

              {paymentMethod === "paystack" && (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-teal-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <span className="text-2xl font-bold text-teal-600">Paystack</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Secure payment processing for Africa and beyond. Pay with your local payment methods.
                  </p>
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                    Continue with Paystack
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-white/95 backdrop-blur sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$289.97</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$23.20</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
              
              <Button 
                onClick={handlePayment}
                disabled={isProcessing || (paymentMethod === "card" && (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName))}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Complete Payment
                  </div>
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                <span>SSL secured checkout</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}