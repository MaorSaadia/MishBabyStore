/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import ky from "ky";
import { StarIcon, UploadCloud, X } from "lucide-react";

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
  const [attachments, setAttachments] = useState<
    {
      id: string;
      file: File;
      url?: string;
      state: "uploading" | "uploaded" | "failed";
    }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When files are selected, trigger uploads
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      // Check max 5 attachments
      if (attachments.length + newFiles.length > 5) {
        alert("You can upload a maximum of 5 images");
        return;
      }
      newFiles.forEach((file) => {
        startUpload(file);
      });
    }
  };

  // Function to start an upload for one file using the reference project's logic
  const startUpload = async (file: File) => {
    const id = crypto.randomUUID();
    // Add file to attachments state with "uploading" state
    setAttachments((prev) => [...prev, { id, file, state: "uploading" }]);

    try {
      // Get the upload URL from your API route (adjust endpoint as needed)
      const { uploadUrl } = await ky
        .get("/api/generateUploadUrl", {
          searchParams: {
            fileName: file.name,
            mimeType: file.type,
            productSlug,
          },
        })
        .json<{ uploadUrl: string }>();

      // Upload the file via PUT. The Wix service is expected to return JSON with file.url.
      const {
        file: { url },
      } = await ky
        .put(uploadUrl, {
          timeout: false,
          body: file,
          headers: {
            "Content-Type": "application/octet-stream",
          },
          searchParams: {
            filename: file.name,
          },
        })
        .json<{ file: { url: string } }>();

      // Update the corresponding attachment with the public URL and mark as "uploaded"
      setAttachments((prev) =>
        prev.map((att) =>
          att.id === id ? { ...att, state: "uploaded", url } : att
        )
      );
      console.log("Public URL:", url);
    } catch (error) {
      console.error("Upload failed:", error);
      // Mark the upload as failed
      setAttachments((prev) =>
        prev.map((att) => (att.id === id ? { ...att, state: "failed" } : att))
      );
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    // Create user name
    const fullName =
      firstName || lastName ? `${firstName} ${lastName}`.trim() : "Anonymous";
    const anonymizedUserName = anonymizeName(fullName);

    setIsSubmitting(true);
    try {
      // Gather URLs from all attachments that uploaded successfully
      const uploadedImageUrls = attachments
        .filter((att) => att.state === "uploaded" && att.url)
        .map((att) => att.url!);

      // Pass the image URLs as an array (not a comma-separated string)
      const images = uploadedImageUrls;

      // Prepare review data including the public image URLs
      const newReview = {
        date: formatDate(new Date()),
        rating,
        userName: anonymizedUserName,
        content: review,
        images, // This is now an array
      };

      // Submit review to your API (adjust endpoint as needed)
      await ky
        .post("/api/addReview", {
          json: { productSlug, review: newReview },
        })
        .json();

      // Callback if review was added successfully
      onReviewAdded?.(newReview);
      // Reset form
      setFirstName("");
      setLastName("");
      setRating(0);
      setReview("");
      setAttachments([]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(
        `Failed to submit review: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Star rating component
  const StarRating = () => (
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

          {/* Image Upload */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="images" className="text-right">
              Photos
            </Label>
            <div className="col-span-3">
              <input
                type="file"
                id="images"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <div className="grid grid-cols-4 gap-2 mb-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="relative h-20 border rounded overflow-hidden"
                  >
                    {att.url ? (
                      <img
                        src={att.url}
                        alt="attachment"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-100">
                        {att.state === "uploading" ? "Uploading..." : "Failed"}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-1 rounded-bl"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={attachments.length >= 5}
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {attachments.length === 0
                  ? "Add Photos"
                  : "Add More Photos"}{" "}
                {attachments.length > 0 && `(${attachments.length}/5)`}
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                You can upload up to 5 images (JPG, PNG)
              </p>
            </div>
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
