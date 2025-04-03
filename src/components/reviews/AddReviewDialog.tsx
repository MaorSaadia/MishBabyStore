/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = [...imageFiles, ...newFiles];

      if (totalFiles.length > 5) {
        alert("You can upload a maximum of 5 images");
        return;
      }

      setImageFiles(totalFiles);
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
    }
  };

  // Remove an image from the selection
  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload an image to Wix Storage
  const uploadImageToWix = async (file: File): Promise<string> => {
    try {
      const response = await fetch(
        `/api/generateUploadUrl?fileName=${encodeURIComponent(
          file.name
        )}&mimeType=${encodeURIComponent(
          file.type
        )}&productSlug=${encodeURIComponent(productSlug)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get upload URL");
      }

      const { uploadUrl, storagePath } = await response.json();

      if (!uploadUrl) {
        throw new Error("No upload URL received");
      }

      // Upload the file to Wix Storage with filename in URL and application/octet-stream
      const uploadResponse = await fetch(
        `${uploadUrl}?filename=${encodeURIComponent(file.name)}`,
        {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Length": file.size.toString(),
          },
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Upload Response Status:", uploadResponse.status);
        console.error("Upload Response Text:", errorText);
        throw new Error(
          `Failed to upload image to Wix Storage: ${uploadResponse.status} - ${errorText}`
        );
      }

      return storagePath;
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    const fullName =
      firstName || lastName ? `${firstName} ${lastName}`.trim() : "Anonymous";
    const anonymizedUserName = anonymizeName(fullName);

    try {
      setIsSubmitting(true);

      // Upload images sequentially
      const uploadedImagePaths: string[] = [];
      if (imageFiles.length > 0) {
        let completedUploads = 0;
        for (const file of imageFiles) {
          const imagePath = await uploadImageToWix(file);
          uploadedImagePaths.push(imagePath);
          completedUploads++;
          setUploadProgress(
            Math.round((completedUploads / imageFiles.length) * 100)
          );
        }
      }

      // Prepare review data
      const newReview = {
        date: formatDate(new Date()),
        rating,
        userName: anonymizedUserName,
        content: review,
        images: uploadedImagePaths,
      };

      // Submit review to API
      const response = await fetch("/api/addReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productSlug, review: newReview }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      const result = await response.json();
      if (result.success) {
        onReviewAdded?.(newReview);
        // Reset form
        setFirstName("");
        setLastName("");
        setRating(0);
        setReview("");
        setImageFiles([]);
        setImagePreviewUrls([]);
        setUploadProgress(0);
        setIsDialogOpen(false);
      } else {
        throw new Error(result.message || "Failed to submit review");
      }
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
                {imagePreviewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative h-20 border rounded overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
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
                disabled={imageFiles.length >= 5}
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {imageFiles.length === 0 ? "Add Photos" : "Add More Photos"}
                {imageFiles.length > 0 && ` (${imageFiles.length}/5)`}
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                You can upload up to 5 images (JPG, PNG)
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {isSubmitting && imageFiles.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Uploading images: {uploadProgress}%
                </p>
              </div>
            </div>
          )}
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
