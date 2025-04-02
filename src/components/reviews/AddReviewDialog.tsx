"use client";

import { useState } from "react";
import { StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { anonymizeName, cn, formatDate } from "@/lib/utils";

interface AddReviewDialogProps {
  productSlug: string;
  onReviewAdded?: (review: any) => void;
}

export function AddReviewDialog({
  productSlug,
  onReviewAdded,
}: AddReviewDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validate inputs
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    // Prepare full name
    const fullName =
      firstName || lastName ? `${firstName} ${lastName}`.trim() : "Anonymous";

    const anonymizedUserName = anonymizeName(fullName);

    // Prepare review data with anonymized name
    const newReview = {
      date: formatDate(new Date()),
      rating: rating,
      userName: anonymizedUserName,
      content: review,
    };
    try {
      setIsSubmitting(true);

      // Submit review via API
      const response = await fetch("/api/addReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productSlug,
          review: newReview,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Call onReviewAdded if provided
        onReviewAdded?.(newReview);

        // Reset form and close dialog
        setFirstName("");
        setLastName("");
        setRating(0);
        setReview("");
        setIsDialogOpen(false);
      } else {
        throw new Error(result.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={cn(
              "text-gray-300 hover:text-yellow-400 transition-colors",
              rating >= star && "text-yellow-500"
            )}
          >
            <StarIcon
              className={cn(
                "w-8 h-8",
                rating >= star ? "fill-current" : "fill-transparent"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Star Rating */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rating" className="text-right">
              Rating
            </Label>
            <div className="col-span-3">
              <StarRating />
            </div>
          </div>

          {/* First Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="(Optional)"
              className="col-span-3"
            />
          </div>

          {/* Last Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="(Optional)"
              className="col-span-3"
            />
          </div>

          {/* Review */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="review" className="text-right">
              Review
            </Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience"
              className="col-span-3 min-h-[100px]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
