'use client';

import { useState, useEffect } from "react";
import { X, Truck, Gift, Percent, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface PromoItem {
  id: string;
  icon: React.ReactNode;
  text: string;
  color: string;
}

export function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const promoItems: PromoItem[] = [
    {
      id: "1",
      icon: <Truck className="h-4 w-4" />,
      text: "FREE shipping on orders over $50 - Limited time offer!",
      color: "bg-teal-600"
    },
    {
      id: "2", 
      icon: <Gift className="h-4 w-4" />,
      text: "Get 20% OFF your first order - Use code WELCOME20",
      color: "bg-purple-600"
    },
    {
      id: "3",
      icon: <Percent className="h-4 w-4" />,
      text: "Summer Sale: Up to 70% OFF selected items",
      color: "bg-orange-600"
    },
    {
      id: "4",
      icon: <Clock className="h-4 w-4" />,
      text: "Flash Deal: Extra 15% OFF - Ends in 24 hours!",
      color: "bg-red-600"
    }
  ];

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [promoItems.length, isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`${promoItems[currentIndex].color} text-white py-2 px-4 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-center"
            >
              {promoItems[currentIndex].icon}
              <span className="text-sm">
                {promoItems[currentIndex].text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-white hover:bg-white/20 w-6 h-6 p-0 flex-shrink-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Progress indicators */}
      <div className="flex justify-center gap-1 mt-1">
        {promoItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}