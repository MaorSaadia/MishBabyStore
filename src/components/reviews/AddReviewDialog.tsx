/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { StarIcon, UploadCloud, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import ky from "ky";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { anonymizeName, cn, formatDate } from "@/lib/utils";

interface AddReviewDialogProps {
  productSlug: string;
  onReviewAdded?: (review: any) => void;
  buttonVariant?: "outline" | "default" | "secondary" | "ghost" | "link";
  buttonText?: string;
}

export function AddReviewDialog({
  productSlug,
  onReviewAdded,
  buttonVariant = "outline",
  buttonText = "Add Review",
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
        toast.error("You can upload a maximum of 5 images");
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
    // const toastId = toast.loading(`Uploading ${file.name}...`);

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
      // toast.success("Image uploaded successfully", { id: toastId });
      // console.log("Public URL:", url);
    } catch (error) {
      console.error("Upload failed:", error);
      // Mark the upload as failed
      setAttachments((prev) =>
        prev.map((att) => (att.id === id ? { ...att, state: "failed" } : att))
      );
      toast.error(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
        // { id: toastId }
      );
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting");
      return;
    }

    // Create user name
    const fullName =
      firstName || lastName ? `${firstName} ${lastName}`.trim() : "Anonymous";
    const anonymizedUserName = anonymizeName(fullName);

    setIsSubmitting(true);

    // Create a loading toast that we'll update later
    // const toastId = toast.loading("Submitting your review...");

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

      // Update the toast to success
      toast.success("Your review has been submitted successfully!");

      // Callback if review was added successfully
      onReviewAdded?.(newReview);

      // Reset form
      setFirstName("");
      setLastName("");
      setRating(0);
      setReview("");
      setAttachments([]);
      setIsDialogOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);

      // Update the toast to error
      toast.error(
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
          <span className="sr-only">{star} star</span>
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          className="group transition-all duration-300 hover:shadow-md"
        >
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-6 border-0 shadow-lg rounded-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-semibold text-center">
            Share Your Experience
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Your review helps others make better choices
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating" className="block text-sm font-medium">
              Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex justify-center py-2">
              <StarRating />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="block text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="(Optional)"
                className="w-full"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="block text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="(Optional)"
                className="w-full"
              />
            </div>
          </div>

          {/* Review */}
          <div className="space-y-2">
            <Label htmlFor="review" className="block text-sm font-medium">
              Your Review <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full min-h-[120px] resize-y"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="images" className="block text-sm font-medium">
              Add Photos
            </Label>
            <input
              type="file"
              id="images"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Image Preview Grid */}
            {attachments.length > 0 && (
              <div className="grid grid-cols-5 gap-3 mb-3">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="relative aspect-square rounded-lg overflow-hidden border bg-gray-50 transition-all duration-200 hover:shadow-md"
                  >
                    {att.state === "uploading" ? (
                      <div className="flex items-center justify-center h-full w-full">
                        <Loader2 className="h-8 w-8 text-cyan-600 animate-spin" />
                      </div>
                    ) : att.state === "failed" ? (
                      <div className="flex items-center justify-center h-full w-full bg-red-50 text-red-500">
                        <X className="w-8 h-8" />
                      </div>
                    ) : (
                      <img
                        src={att.url}
                        alt="Review attachment"
                        className="h-full w-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-all"
                    >
                      <X className="w-3 h-3" />
                      <span className="sr-only">Remove image</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full border-dashed py-6 hover:bg-gray-50 transition-all",
                attachments.length >= 5 && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => fileInputRef.current?.click()}
              disabled={attachments.length >= 5}
            >
              <UploadCloud className="mr-2 h-5 w-5" />
              {attachments.length === 0
                ? "Add Photos"
                : `Add More Photos (${attachments.length}/5)`}
            </Button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              You can upload up to 5 images to help others see your experience
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="w-full py-6 text-base font-medium transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
