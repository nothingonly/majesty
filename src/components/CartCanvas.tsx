"use client";

import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

type RazorpayResponse = {
  razorpay_payment_id: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

export default function CartCanvas() {
  const { isCartOpen, closeCart, items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();

  useEffect(() => {
    // Dynamically load Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = () => {
    const total = getTotal();
    if (total === 0) return;

    const options = {
      key: "rzp_test_dummykey123", // Dummy test key as requested
      amount: total * 100, // Amount in paise
      currency: "INR",
      name: "Majesty Mandi House",
      description: "Premium Arabian Dining",
      image: "https://your-domain.com/logo.jpg", // Ideally an absolute URL
      handler: function (response: RazorpayResponse) {
        // Payment successful
        const paymentId = response.razorpay_payment_id;
        
        // Format WhatsApp message
        let receiptText = `*Majesty Mandi House - Order Receipt*\n\n`;
        items.forEach(item => {
          receiptText += `${item.quantity}x ${item.name} - ₹${item.price * item.quantity}\n`;
        });
        receiptText += `\n*Total:* ₹${total}\n*Payment ID:* ${paymentId}\n\nThank you for ordering!`;

        const encodedText = encodeURIComponent(receiptText);
        window.open(`https://wa.me/918121213533?text=${encodedText}`, "_blank");
        
        clearCart();
        closeCart();
      },
      prefill: {
        name: "Royal Guest",
        email: "guest@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#DFB15B"
      }
    };

    if (!window.Razorpay) return;
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-obsidian border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-serif text-2xl text-imperial flex items-center gap-3">
                <ShoppingBag /> Your Order
              </h2>
              <button onClick={closeCart} className="text-white/60 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p>Your royal feast is empty.</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-transparent">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                      ) : (
                        <div className="w-full h-full bg-imperial/10" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <p className="text-imperial text-sm">₹{item.price}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-obsidian rounded-lg border border-white/10 px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="text-white/60 hover:text-imperial disabled:opacity-50">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white/60 hover:text-imperial">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-red-400/80 hover:text-red-400 text-sm underline underline-offset-2">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white/70">Subtotal</span>
                  <span className="font-serif text-2xl text-amber">₹{getTotal()}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-imperial text-obsidian font-bold tracking-widest rounded-xl hover:bg-amber hover:shadow-[0_0_30px_rgba(243,168,51,0.5)] transition-all duration-300 transform hover:-translate-y-1"
                >
                  PAY & ORDER
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
