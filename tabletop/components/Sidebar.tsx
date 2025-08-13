import { useState } from "react";
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar,
  CheckSquare,
  ShoppingBag,
  Package,
  Receipt,
  CreditCard,
  ReceiptText, // ✅ replacement for FileInvoice
  Users,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
}

export function Sidebar({ activeItem, onNavigate }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['ecommerce', 'productivity']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      type: 'single' as const
    },
    {
      id: 'inner-pages',
      label: 'Inner Pages',
      icon: FileText,
      type: 'expandable' as const,
      children: [
        { id: 'profile', label: 'Profile' },
        { id: 'settings', label: 'Settings' }
      ]
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      type: 'single' as const
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Phone,
      type: 'single' as const
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      type: 'single' as const,
      badge: '2'
    },
    {
      id: 'social',
      label: 'Social',
      icon: Users,
      type: 'single' as const
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: Calendar,
      type: 'single' as const
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      type: 'single' as const,
      badge: '4'
    },
    {
      id: 'ecommerce',
      label: 'Ecommerce',
      icon: ShoppingBag,
      type: 'expandable' as const,
      children: [
        { id: 'product-catalogues', label: 'Product Catalogues' },
        { id: 'product-details', label: 'Product Details' },
        { id: 'checkout-page', label: 'Checkout page' },
        { id: 'dynamic-invoice', label: 'Dynamic Invoice', icon: ReceiptText } // ✅ optional icon
      ]
    },
    {
      id: 'productivity',
      label: 'Productivity',
      icon: CheckSquare,
      type: 'expandable' as const,
      children: [
        { id: 'calendar', label: 'Calendar' },
        { id: 'task-board', label: 'Task Board' }
      ]
    }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b3d8?w=100&h=100&fit=crop&crop=face" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">Avril Jane</div>
            <div className="flex items-center text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.type === 'single' ? (
                <Button
                  variant={activeItem === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start text-sm h-9 px-3 ${
                    activeItem === item.id 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ) : (
                <Collapsible 
                  open={expandedSections.includes(item.id)}
                  onOpenChange={() => toggleSection(item.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm h-9 px-3 text-gray-700 hover:bg-gray-50"
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {expandedSections.includes(item.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-7 mt-1 space-y-1">
                    {item.children?.map((child) => (
                      <Button
                        key={child.id}
                        variant={activeItem === child.id ? "secondary" : "ghost"}
                        className={`w-full justify-start text-sm h-8 px-3 ${
                          activeItem === child.id 
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        onClick={() => onNavigate(child.id)}
                      >
                        {child.icon && <child.icon className="w-4 h-4 mr-2" />}
                        {child.label}
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Sign-in/Sign-up Section */}
      <div className="p-4 border-t border-gray-200">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-sm h-9 px-3 text-gray-700">
              <Users className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">Signin/ Signup</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-7 mt-1 space-y-1">
            <Button variant="ghost" className="w-full justify-start text-sm h-8 px-3 text-gray-600">
              Sign In
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm h-8 px-3 text-gray-600">
              Sign Up
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
