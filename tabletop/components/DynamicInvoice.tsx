import { useState } from "react";
import { Download, Printer, Mail, Calendar, Hash, MapPin, CreditCard, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./fallback/ImageWithFallback";

export interface InvoiceData {
  invoiceNumber: string;
  orderDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  customer: {
    name: string;
    email: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  items: {
    id: string;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    image?: string;
  }[];
  subtotal: number;
  tax: number;
  taxRate: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  notes?: string;
}

interface DynamicInvoiceProps {
  invoiceData?: InvoiceData;
  onClose?: () => void;
  onBack?: () => void;
  onNewOrder?: () => void;
}

/**
 * Default invoice data for demo purposes
 * Uses current date for realistic order dates
 */
const defaultInvoiceData: InvoiceData = {
  invoiceNumber: "INV-2025-0001",
  orderDate: new Date().toISOString(), // Current date
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  status: "paid",
  customer: {
    name: "Narh Kofi",
    email: "narh.kofi@example.com",
    address: {
      line1: "7th Street-Teshie",
      line2: "HNO. 4B77/Ts",
      city: "Ghana",
      state: "GH",
      zip: "",
      country: "Ghana"
    }
  },
  items: [
    
    
    
  ],
  subtotal: 309.97,
  tax: 24.80,
  taxRate: 8,
  shipping: 0,
  discount: 0,
  total: 334.77,
  paymentMethod: "Credit Card ending in 4567",
  notes: "Thank you for your purchase! Your items will be shipped within 2-3 business days."
};

export function DynamicInvoice({ invoiceData = defaultInvoiceData, onClose, onBack, onNewOrder }: DynamicInvoiceProps) {
  const [isPrintView, setIsPrintView] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  /**
   * Handle printing only the invoice content
   * Creates a new window with just the invoice and prints it
   */
  const handlePrint = () => {
    setIsPrintView(true);
    
    // Create a new window for printing only the invoice
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    // Get the invoice content
    const invoiceElement = document.getElementById('invoice-content');
    if (!invoiceElement) return;
    
    // Create print-friendly HTML
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .text-2xl { font-size: 24px; }
            .text-xl { font-size: 20px; }
            .text-lg { font-size: 18px; }
            .mb-4 { margin-bottom: 16px; }
            .mb-2 { margin-bottom: 8px; }
            .p-4 { padding: 16px; }
            .border { border: 1px solid #ddd; }
            .rounded { border-radius: 8px; }
            .bg-teal-500 { background-color: #14b8a6; color: white; padding: 8px; border-radius: 4px; }
            .grid { display: grid; }
            .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
            .gap-4 { gap: 16px; }
            .space-y-2 > * + * { margin-top: 8px; }
            .text-gray-600 { color: #6b7280; }
            .text-gray-800 { color: #1f2937; }
            .text-teal-600 { color: #0d9488; }
          </style>
        </head>
        <body>
          ${invoiceElement.innerHTML}
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setIsPrintView(false);
    }, 500);
  };

  /**
   * Handle PDF download of the invoice using HTML to PDF conversion
   * This creates a proper PDF file instead of HTML
   */
  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    
    try {
      // Dynamic import of jsPDF to avoid SSR issues
      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas').then(module => module.default);
      
      const invoiceElement = document.getElementById('invoice-content');
      if (!invoiceElement) {
        console.error('Invoice content element not found');
        return;
      }

      // Temporarily set the element to be visible and styled for PDF
      const originalStyle = invoiceElement.style.cssText;
      invoiceElement.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 800px;
        background: white;
        padding: 40px;
        font-family: Arial, sans-serif;
      `;

      // Wait for any images to load
      const images = invoiceElement.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
          }
        });
      }));

      // Generate canvas from HTML
      const canvas = await html2canvas(invoiceElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 800,
        height: invoiceElement.scrollHeight
      });

      // Restore original styles
      invoiceElement.style.cssText = originalStyle;

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.height / canvas.width;
      const pdfAspectRatio = pdfHeight / pdfWidth;
      
      let renderWidth, renderHeight;
      
      if (canvasAspectRatio > pdfAspectRatio) {
        renderHeight = pdfHeight - 20; // 10mm margin on top and bottom
        renderWidth = renderHeight / canvasAspectRatio;
      } else {
        renderWidth = pdfWidth - 20; // 10mm margin on left and right
        renderHeight = renderWidth * canvasAspectRatio;
      }
      
      const xOffset = (pdfWidth - renderWidth) / 2;
      const yOffset = (pdfHeight - renderHeight) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, renderWidth, renderHeight);
      
      // Save the PDF
      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
      
      console.log(`Invoice ${invoiceData.invoiceNumber} downloaded as PDF`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to HTML download if PDF generation fails
      handleDownloadHTML();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  /**
   * Fallback HTML download method
   */
  const handleDownloadHTML = () => {
    const invoiceElement = document.getElementById('invoice-content');
    if (!invoiceElement) return;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <meta charset="UTF-8">
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 12px 8px; text-align: left; border-bottom: 1px solid #ddd; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .text-2xl { font-size: 24px; }
            .text-xl { font-size: 20px; }
            .text-lg { font-size: 18px; }
            .mb-4 { margin-bottom: 16px; }
            .mb-2 { margin-bottom: 8px; }
            .p-4 { padding: 16px; }
            .border { border: 1px solid #ddd; }
            .rounded { border-radius: 8px; }
            .bg-teal-500 { background-color: #14b8a6; color: white; padding: 8px; border-radius: 4px; display: inline-block; }
            .grid { display: grid; }
            .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
            .gap-4 { gap: 16px; }
            .space-y-2 > * + * { margin-top: 8px; }
            .text-gray-600 { color: #6b7280; }
            .text-gray-800 { color: #1f2937; }
            .text-teal-600 { color: #0d9488; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${invoiceElement.innerHTML}
          </div>
        </body>
      </html>
    `;
    
    // Create and trigger download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceData.invoiceNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`Invoice ${invoiceData.invoiceNumber} downloaded as HTML file`);
  };

  const handleEmail = () => {
    // In a real app, this would open email client or send email
    const subject = `Invoice ${invoiceData.invoiceNumber}`;
    const body = `Please find attached your invoice ${invoiceData.invoiceNumber} for the amount of $${invoiceData.total.toFixed(2)}.`;
    const mailtoLink = `mailto:${invoiceData.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 text-white hover:text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Invoice</h1>
            <p className="text-gray-600">Invoice #{invoiceData.invoiceNumber}</p>
          </div>
          
          {!isPrintView && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
              >
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          )}
        </div>

        {/* Invoice Card - Wrapped with ID for printing */}
        <Card className="mb-6">
          <CardContent className="p-8" id="invoice-content">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">TableTop</h2>
                  <p className="text-sm text-gray-600">Premium E-commerce Solutions</p>
                </div>
              </div>
              
              <div className="text-right">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">INVOICE</h3>
                <Badge className={`${getStatusColor(invoiceData.status)} text-white uppercase`}>
                  {invoiceData.status}
                </Badge>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash className="h-4 w-4" />
                  <span>Invoice Number: {invoiceData.invoiceNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Date: {new Date(invoiceData.orderDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Due Date: {new Date(invoiceData.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="h-4 w-4" />
                  <span>Payment: {invoiceData.paymentMethod}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">Bill To:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-800">{invoiceData.customer.name}</p>
                  <p>{invoiceData.customer.email}</p>
                  <div className="flex items-start gap-2 mt-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{invoiceData.customer.address.line1}</p>
                      {invoiceData.customer.address.line2 && <p>{invoiceData.customer.address.line2}</p>}
                      <p>{invoiceData.customer.address.city}, {invoiceData.customer.address.state} {invoiceData.customer.address.zip}</p>
                      <p>{invoiceData.customer.address.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">From:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-800">TableTop Inc.</p>
                  <p>contact@tabletop.com</p>
                  <div className="flex items-start gap-2 mt-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>123 Commerce Street</p>
                      <p>Business District</p>
                      <p>New York, NY 10001</p>
                      <p>United States</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Items Table */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-800 mb-4">Items</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Item</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Qty</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Unit Price</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-4 text-gray-700">{item.quantity}</td>
                        <td className="text-right py-4 text-gray-700">${item.unitPrice.toFixed(2)}</td>
                        <td className="text-right py-4 font-medium text-gray-800">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800">${invoiceData.subtotal.toFixed(2)}</span>
                </div>
                {invoiceData.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600">-${invoiceData.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-800">${invoiceData.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({invoiceData.taxRate}%):</span>
                  <span className="text-gray-800">${invoiceData.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-teal-600">${invoiceData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoiceData.notes && (
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-medium text-gray-800 mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{invoiceData.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-gray-600">
                Thank you for your business! For any questions about this invoice, please contact us at contact@tabletop.com
              </p>
            </div>
          </CardContent>
        </Card>

        {!isPrintView && (
          <div className="flex justify-center gap-4 mt-6">
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Close Invoice
              </Button>
            )}
            {onNewOrder && (
              <Button onClick={onNewOrder} className="bg-teal-500 hover:bg-teal-600 text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Place New Order
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}