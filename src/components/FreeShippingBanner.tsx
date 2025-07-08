import Link from "next/link";

interface FreeShippingBannerProps {
  className?: string;
  variant?: "default" | "compact" | "inline";
}

const FreeShippingBanner: React.FC<FreeShippingBannerProps> = ({
  className = "",
  variant = "default",
}) => {
  const baseClasses = "text-center";

  const variantClasses = {
    default: "bg-green-50 border border-green-200 rounded-lg p-4",
    compact: "bg-green-50 border border-green-200 rounded-md p-3",
    inline: "inline-block",
  };

  const textClasses = {
    default: "text-green-800 sm:text-lg",
    compact: "text-green-800 text-sm",
    inline: "text-green-700 text-sm",
  };

  const linkClasses = {
    default: "text-green-700 hover:text-green-900 underline font-medium",
    compact:
      "text-green-700 hover:text-green-900 underline font-medium text-sm",
    inline: "text-green-600 hover:text-green-800 underline",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <p className={textClasses[variant]}>
        🚚 <strong>Free Shipping</strong> on all orders to all the{" "}
        <Link href="/shipping-restrictions" className={linkClasses[variant]}>
          supported countries
        </Link>
      </p>
    </div>
  );
};

export default FreeShippingBanner;
