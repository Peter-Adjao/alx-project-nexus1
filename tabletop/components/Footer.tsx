import { Facebook, Twitter, Instagram, Linkedin, Youtube, Package, Smartphone, Download, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className=" flex items-center justify-center">
              </div>
              <span className="text-xl font-bold text-white">TableTop</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Simply, shop with confidence.
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-2 pt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 " />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Company info.</h3>
            <div className="space-y-3">
              {[
                { label: "About Us", href: "#" },
                { label: "Contact", href: "#" },
                { label: "FAQ", href: "#" },
                { label: "Shipping", href: "#" }
              ].map((link) => (
                <a 
                  key={link.label}
                  href={link.href} 
                  className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Customer Service</h3>
            <div className="space-y-3">
              {[
                { label: "Returns", href: "#" },
                { label: "Size Guide", href: "#" },
                { label: "Track Order", href: "#" },
                { label: "Support", href: "#" }
              ].map((link) => (
                <a 
                  key={link.label}
                  href={link.href} 
                  className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Legal</h3>
            <div className="space-y-3">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Cookie Policy", href: "#" },
                { label: "Accessibility", href: "#" }
              ].map((link) => (
                <a 
                  key={link.label}
                  href={link.href} 
                  className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base">Newsletter</h3>
            <p className="text-gray-300 text-sm">
              Subscribe to get updates on new products and offers.
            </p>
            <div className="space-y-3">
              <div className="flex">
                <Input 
                  placeholder="Your email" 
                  className="bg-slate-800 border-slate-700 text-white placeholder-gray-400 rounded-r-none focus:border-pink-500 transition-colors"
                />
                <Button 
                  className="bg-[#30B69AFF] hover:bg-[#30B69AFF]-200 text-white rounded-l-none px-6 transition-all duration-200"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Download Our App Section */}
        <div className="mb-12">
          <h4 className="text-white font-semibold mb-4">Download our app</h4>
          <div className="flex flex-wrap gap-4">
            {/* Google Play Store */}
            <Button 
              variant="outline" 
              className="bg-black border-gray-600 text-white hover:bg-gray-800 transition-all duration-200 px-4 py-2 h-auto"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white rounded p-1">
                  <Play className="h-5 w-5 text-black" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-300 leading-tight">GET IT ON</div>
                  <div className="text-sm font-semibold leading-tight">Google Play</div>
                </div>
              </div>
            </Button>

            {/* App Store */}
            <Button 
              variant="outline" 
              className="bg-black border-gray-600 text-white hover:bg-gray-800 transition-all duration-200 px-4 py-2 h-auto"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white rounded p-1">
                  <Download className="h-5 w-5 text-black" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-300 leading-tight">DOWNLOAD ON THE</div>
                  <div className="text-sm font-semibold leading-tight">App Store</div>
                </div>
              </div>
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-700 mb-8" />
        
        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            © 2025 TableTop. All rights reserved.
          </div>
          
          <div className="text-sm text-gray-400 text-center lg:text-right">
            Follow us for updates and exclusive offers!
            <span className="ml-2 text-white">?</span>
          </div>
        </div>
      </div>
    </footer>
  );
}