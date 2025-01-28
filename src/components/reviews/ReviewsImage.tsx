/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ReviewsImage = ({ images }: { images: any[] }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((media: any) => (
          <div
            key={media.id}
            className="aspect-square relative overflow-hidden rounded-md"
          >
            <img
              src={media.url}
              alt=""
              className="object-cover hover:scale-105 transition-transform duration-200 cursor-pointer w-full h-full"
              onClick={() => setSelectedImage(media.url)}
            />
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-4">
          <div className="relative flex items-center justify-center w-full h-full">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Enlarged review image"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewsImage;
