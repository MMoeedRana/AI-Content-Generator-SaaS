"use client";

import React, { useState } from "react";
import { Star, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { UserReviews } from "@/utils/schema";
import moment from "moment";
import { toast } from "sonner";
import confetti from "canvas-confetti";

function Feedback() {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select stars first!");
      return;
    }
    setLoading(true);
    try {
      await db.insert(UserReviews).values({
        userName: user?.fullName || "GenFlow User",
        userEmail: user?.primaryEmailAddress?.emailAddress || "",
        userImage: user?.imageUrl,
        rating: rating,
        reviewText: review,
        createdAt: moment().format("DD/MM/YYYY"),
      });

      // Celebration Effect!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B']
      });

      toast.success("Shukriya! Your feedback is saved.");
      setReview("");
      setRating(0);
    } catch (e) {
      toast.error("Error saving review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 border p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-primary w-8 h-8 fill-primary" />
          </div>
          <h1 className="text-3xl font-bold dark:text-white">Share Your Experience</h1>
          <p className="text-gray-500 mt-2 text-sm">GenFlow AI ko top-notch banane mein hamari help karein.</p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-12 h-12 cursor-pointer transition-all active:scale-90 ${
                rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-slate-700"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <Textarea
          placeholder="What do you love about GenFlow AI? Any suggestions?"
          className="mb-6 min-h-[150px] rounded-xl border-gray-200 dark:bg-slate-800"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <Button 
          className="w-full py-7 rounded-xl text-lg flex gap-2 transition-all hover:shadow-lg active:scale-[0.98]"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit Review"}
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default Feedback