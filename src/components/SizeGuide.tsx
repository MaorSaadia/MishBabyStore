"use client";

import { useState } from "react";
import Image from "next/image";

import { ArrowRight, ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface SizeGuideProps {
  collectionId?: string;
}

const SizeGuide: React.FC<SizeGuideProps> = ({ collectionId }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (collectionId !== "b36c1c8c-a1ac-4682-9e34-a630b932325c") {
    return null;
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-lg transition-colors"
      >
        <div className="flex items-center">
          <span className="font-medium text-gray-900">SIZE Guide</span>
          <ArrowRight className="w-4 h-4 ml-2 text-gray-600" />
        </div>
        {/* <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        /> */}
      </button>

      {isOpen && (
        <div className="mt-4">
          <Tabs defaultValue="clothes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clothes">Clothes</TabsTrigger>
              <TabsTrigger value="shoes">Shoes</TabsTrigger>
            </TabsList>

            <TabsContent value="clothes" className="mt-4">
              <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <Image
                  src="/size-details.png"
                  alt="Size Details"
                  className="w-full h-auto"
                  width={800}
                  height={500}
                  priority
                />
                <Image
                  src="/kid-size.png"
                  alt="Kid Size"
                  className="w-full h-auto"
                  width={800}
                  height={500}
                />
                <Image
                  src="/size-3.png"
                  alt="Kid Information"
                  className="w-full h-auto"
                  width={800}
                  height={500}
                />
              </div>
            </TabsContent>

            <TabsContent value="shoes" className="mt-4">
              <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <Image
                  src="/shoe-size.png"
                  alt="Shoe Size Guide"
                  className="w-full h-auto"
                  width={800}
                  height={500}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default SizeGuide;
