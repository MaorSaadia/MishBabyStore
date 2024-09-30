import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-sky-100 text-gray-700 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and social media */}
          <div className="flex flex-col items-center sm:items-start">
            <Image
              src="/mb-logo.png"
              alt="logo"
              width={100}
              height={100}
              className="mb-4"
            />
            <p className="font-semibold mb-4 text-sm">
              MishBabySupport@gmail.com
            </p>
            <div className="flex gap-4">
              {["facebook", "instagram", "youtube", "pinterest", "x"].map(
                (social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="transition-transform hover:scale-110"
                  >
                    <Image
                      src={`/${social}.png`}
                      alt={social}
                      width={20}
                      height={20}
                    />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Shop and Help links */}
          <div className="sm:col-span-1 lg:col-span-2 flex justify-center sm:justify-start w-full">
            <div className="grid grid-cols-2 gap-8 sm:gap-4 w-full max-w-sm sm:max-w-none">
              {/* Shop links */}
              <div className="text-center sm:text-left">
                <h2 className="font-medium text-base text-cyan-600 mb-3">
                  SHOP
                </h2>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: "/list?cat=all-products", label: "All Products" },
                    {
                      href: "/list?cat=all-products&filter=New Arrival",
                      label: "New Arrivals",
                    },
                    {
                      href: "/list?cat=all-products&filter=Sale",
                      label: "Deals",
                    },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="hover:text-cyan-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Help links */}
              <div className="text-center sm:text-left">
                <h2 className="font-medium text-base text-cyan-600 mb-3">
                  HELP
                </h2>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: "/faq", label: "FAQ" },
                    { href: "/customer-service", label: "Customer Service" },
                    { href: "/privacy-policy", label: "Privacy Policy" },
                    { href: "/terms-of-service", label: "Terms of Service" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="hover:text-cyan-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Payment options */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="font-medium text-base text-cyan-600 mb-3 text-center sm:text-left">
              Secure Payments
            </h2>
            <div className="flex justify-center sm:justify-start space-x-4">
              {["paypal", "mastercard", "visa"].map((payment) => (
                <Image
                  key={payment}
                  src={`/${payment}.png`}
                  alt={payment}
                  width={40}
                  height={25}
                  className="transition-transform hover:scale-110"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-sky-200 pt-4 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className="mb-2 sm:mb-0">
            &copy; 2024 MishBaby. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">Language:</span>
              <span className="font-medium">English (US)</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">Currency:</span>
              <span className="font-medium">$ USD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
