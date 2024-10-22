"use client";

import { useState } from "react";
import Image from "next/image";

import { Dialog, DialogContent } from "@/components/ui/dialog";

const ReviewsImage = ({ images }: { images: any[] }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {images.map((media: any) => (
          <Image
            src={media.url}
            key={media.id}
            alt=""
            width={100}
            height={100}
            className="object-cover rounded-md cursor-pointer"
            onClick={() => setSelectedImage(media.url)}
          />
        ))}
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-3xl">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Enlarged review image"
              width={800}
              height={600}
              className="w-full h-auto object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewsImage;
