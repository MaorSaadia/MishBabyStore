import Link from "next/link";
import { Info } from "lucide-react";

const ShippingBanner = () => {
  return (
    <div className="bg-rose-200 py-3 text-center mb-2 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Info className="w-12 h-12 sm:w-5 sm:h-5 text-cyan-600 mr-2" />
        <p className="text-sm text-gray-700">
          Free shipping to most countries!
          <span className="font-medium"> $2.99 shipping to US</span> due to
          recent tariff changes.
          <Link
            href="/shipping-restrictions"
            className="ml-1 text-cyan-600 hover:underline"
          >
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ShippingBanner;
