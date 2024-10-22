"use client";

import { useState } from "react";
import Image from "next/image";
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
            <Image
              src={media.url}
              alt=""
              fill
              className="object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => setSelectedImage(media.url)}
            />
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="h-[90vh] p-2">
          <div className="relative w-full h-full">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Enlarged review image"
                fill
                className="p-8"
                priority
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewsImage;
