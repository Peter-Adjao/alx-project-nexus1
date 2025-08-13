'use client';

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Calendar,
  ClipboardList,
  Mail,
  Users,
  ShoppingCart,
  ChevronRight,
  ChevronDown,
  X
} from "lucide-react";
import { useState } from "react";
import { Page } from "../App";

// Types for child items
type SidebarChildItem = {
  label: string;
  page?: Page;
  active?: boolean;
  action?: () => void;
  isLogout?: boolean;
};

// Types for main menu items
type SidebarItem = {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  expandable: boolean;
  isActive?: boolean;
  page?: Page;
  badge?: string;
  children?: SidebarChildItem[];
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (page: Page) => void;
  onProfileClick?: () => void;
  onAuthClick?: (authType: "signin" | "signup" | "profile") => void;
  user?: { id: string; name: string; email: string; avatar?: string } | null;
  onLogout?: () => void;
}

export function AppSidebar({ isOpen = false, onClose, onNavigate, onProfileClick, onAuthClick, user, onLogout }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['ecommerce']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleNavigation = (page: Page) => {
    onNavigate?.(page);
    onClose?.(); // Close sidebar after navigation on mobile
  };

  const menuItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      expandable: true,
      children: [
        { label: 'Home', page: 'home' }
      ]
    },
    {
      id: 'pages',
      label: 'Inner Pages',
      icon: FileText,
      expandable: true,
      children: [
        { label: 'Profile', page: 'profile' },
        { label: 'Settings', page: 'settings' }
      ]
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      expandable: false
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Users,
      expandable: false
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      expandable: false,
      badge: '2'
    },
    {
      id: 'social',
      label: 'Social',
      icon: Users,
      expandable: false
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: Calendar,
      expandable: false
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      expandable: false,
      badge: '3'
    },
    {
      id: 'ecommerce',
      label: 'Ecommerce',
      icon: ShoppingCart,
      expandable: true,
      isActive: true,
      children: [
        { label: 'Product Catalogues', active: true, page: 'products' },
        { label: 'Product Details', page: 'product-detail' },
        { label: 'Checkout page', page: 'checkout' },
        { label: 'Dynamic Invoice', page: 'invoice' },
        { label: 'Categories', page: 'categories' },
        { label: 'Orders', page: 'orders' },
        { label: 'Wishlist', page: 'wishlist' }
      ]
    },
    {
      id: 'productivity',
      label: 'Productivity',
      icon: ClipboardList,
      expandable: true,
      children: [
        { label: 'Calendar' },
        { label: 'Task Board' }
      ]
    },
    {
      id: 'support',
      label: 'Support',
      icon: MessageSquare,
      expandable: false,
      page: 'support'
    },
    {
      id: 'auth',
      label: user ? 'Account' : 'Sign In / Sign up',
      icon: Users,
      expandable: true,
      children: user ? [
        { label: 'Profile Settings', action: () => onAuthClick?.('profile') },
        { label: 'My Orders', page: 'orders' },
        { label: 'Wishlist', page: 'wishlist' },
        { label: 'Logout', action: onLogout, isLogout: true }
      ] : [
        { label: 'Sign In', action: () => onAuthClick?.('signin') },
        { label: 'Sign Up', action: () => onAuthClick?.('signup') }
      ]
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div 
            className="flex flex-col items-center text-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2"
            onClick={onProfileClick}
          >
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"} />
              <AvatarFallback>{user?.name?.[0] || "AJ"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-gray-900">{user?.name || "Avril Jane"}</div>
              <div className="text-sm text-green-500 flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {user ? "Online" : "Guest"}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-between h-auto p-3 ${
                    item.isActive ? 'bg-teal-50 text-teal-600 border-l-2 border-teal-500' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    if (item.expandable) {
                      toggleSection(item.id);
                    } else if (item.page) {
                      handleNavigation(item.page);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <Badge variant="secondary" className="bg-teal-500 text-white text-xs px-2 py-1">
                        {item.badge}
                      </Badge>
                    )}
                    {item.expandable && (
                      expandedSections.includes(item.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </Button>
                
                {/* Submenu */}
                {item.expandable && expandedSections.includes(item.id) && item.children && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className={`w-full justify-start h-auto p-2 text-sm ${
                          child.active ? 'text-teal-600 bg-teal-50' : 
                          child.isLogout ? 'text-red-600 hover:bg-red-50' : 
                          'text-gray-600 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          if (child.page) {
                            handleNavigation(child.page);
                          } else if (child.action) {
                            child.action();
                          }
                        }}
                      >
                        {child.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
