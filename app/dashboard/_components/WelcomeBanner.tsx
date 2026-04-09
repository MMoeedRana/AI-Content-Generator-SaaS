"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Sparkles, X } from "lucide-react";
import confetti from "canvas-confetti";

function WelcomeBanner() {
  const { user, isLoaded } = useUser();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Sirf tab chale jab user data load ho jaye
    if (isLoaded && user) {
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
      
      // Agar localStorage mein ye key nahi hai, sirf tabhi show karo
      if (!hasSeenWelcome) {
        setShow(true);
        
        // Light Confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#9981f9", "#ffffff"]
        });

        // LocalStorage foran set kar dein taake refresh par dobara na aaye
        localStorage.setItem("hasSeenWelcome", "true");

        // 8 seconds baad hide kar dein
        const timer = setTimeout(() => setShow(false), 8000);
        return () => clearTimeout(timer);
      }
    }
  }, [user, isLoaded]);

  // Agar user logout ho jaye to localStorage reset kar sakte hain (Optional)
  // Is se agli baar login par phir se dikhega

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed bottom-10 right-5 z-[100] max-w-sm px-4"
        >
          <div className="bg-white dark:bg-gray-900 border-l-4 border-primary shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-xl p-5 relative overflow-hidden">
            
            <button 
              onClick={() => setShow(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                <Sparkles className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                  Welcome, {user?.firstName || "User"}! 🎉
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  Your **AI Content Journey** starts here. We've credited your account with free tokens!
                </p>
              </div>
            </div>
            
            {/* Progress Bar Timer */}
            <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 8, ease: "linear" }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WelcomeBanner;