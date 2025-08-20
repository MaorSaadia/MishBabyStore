/* eslint-disable @next/next/no-img-element */
import { Shield, Lock } from "lucide-react";
import { motion } from "framer-motion";

const SecurePaymentIndicator = () => {
  // PayPal has been removed from this list and will be displayed separately
  const paymentMethods = [
    { name: "Visa", src: "/payment-icons/visa.png" },
    { name: "Mastercard", src: "/payment-icons/mastercard.png" },
    { name: "American Express", src: "/payment-icons/american-express.png" },
    { name: "Discover", src: "/payment-icons/discover.png" },
    { name: "Max", src: "/payment-icons/max.png" },
    { name: "Isracard", src: "/payment-icons/isracard.png" },
    { name: "Diners Club", src: "/payment-icons/diners-club.png" },
    { name: "JCB", src: "/payment-icons/jcb.png" },
    { name: "Maestro", src: "/payment-icons/maestro.png" },
  ];

  // --- ANIMATION SETTINGS ---
  const LOGO_WIDTH = 56; // width of one logo card in pixels (w-14)
  const GAP = 12; // gap between logos in pixels (gap-3)
  // Increased from 1.5 to 2.5 to make the animation slower
  const DURATION_PER_LOGO = 2;

  const totalWidth = (LOGO_WIDTH + GAP) * paymentMethods.length;
  const totalDuration = DURATION_PER_LOGO * paymentMethods.length;

  return (
    <div className="mt-4">
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">
              Secure Payment via PayPlus
            </span>
          </div>
          <Lock className="w-4 h-4 text-gray-400" />
        </div>

        <p className="text-center text-xs text-gray-500 my-3">
          We accept all major credit cards.
        </p>

        {/* Carousel Viewport */}
        <div className="relative h-10 w-full overflow-hidden mask-image-lr">
          <motion.div
            className="absolute left-0 top-0 flex h-full items-center gap-3"
            animate={{ x: [0, -totalWidth] }}
            transition={{
              duration: totalDuration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
          >
            {[...paymentMethods, ...paymentMethods].map((method, index) => (
              <div
                key={index}
                className="h-8 w-14 flex-shrink-0 rounded-md border bg-white p-1 flex items-center justify-center shadow-sm"
                title={method.name}
              >
                <img
                  src={method.src}
                  alt={method.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* --- NEW PAYPAL SECTION --- */}
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-center gap-1 -mb-2">
          <span className="text-sm text-gray-600">We also accept</span>
          <img
            src="/payment-icons/paypal.png"
            alt="PayPal"
            className="h-7 -mb-1" // Larger logo
          />
        </div>
      </div>

      <style jsx global>{`
        .mask-image-lr {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }
      `}</style>
    </div>
  );
};

export default SecurePaymentIndicator;
