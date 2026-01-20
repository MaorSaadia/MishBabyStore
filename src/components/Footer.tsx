import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const socialIcons = [
    {
      name: "Instagram",
      icon: "instagram",
      url: "https://www.instagram.com/mishbabystore",
    },

    {
      name: "facebook",
      icon: "facebook",
      url: "https://www.facebook.com/profile.php?id=61567086625746",
    },
    {
      name: "YouTube",
      icon: "youtube",
      url: "https://www.youtube.com/@MishBabyShop",
    },
    {
      name: "TikTok",
      icon: "tiktok",
      url: "https://www.tiktok.com/@mishbaby_shop",
    },
    // {
    //   name: "Pinterest",
    //   icon: "pinterest",
    //   url: "https://www.pinterest.com/mishbabys",
    // },
  ];

  return (
    <footer className="mt-12 bg-sky-100 text-gray-700 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          {/* Logo and social media */}
          <div className="flex flex-col items-center sm:items-start">
            <Image
              src="/mb-logo.png"
              alt="logo"
              width={60}
              height={60}
              className="mb-2 w-auto h-auto"
            />
            <p className="font-semibold mb-2 text-sm">mishbabyshop@gmail.com</p>
            <div className="flex flex-col items-center sm:items-start">
              <p className="text-cyan-600 font-medium mb-2">Follow Us On</p>
              <div className="flex gap-4 -mb-2">
                {socialIcons.map((social) => (
                  <a
                    key={social.icon}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group transition-transform hover:scale-110"
                  >
                    <Image
                      src={`/${social.icon}.png`}
                      alt={social.name}
                      width={24}
                      height={24}
                    />
                    <span className="mb-1 absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Shop and Help links */}
          <div className="sm:col-span-1 lg:col-span-2 flex justify-center sm:justify-start w-full">
            <div className="grid grid-cols-2 gap-6 sm:gap-4 w-full max-w-sm sm:max-w-none">
              {/* Shop links */}
              <div className="text-center sm:text-left">
                <h2 className="font-medium text-base text-cyan-600 mb-3">
                  SHOP
                </h2>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: "/list?cat=all-products", label: "All Products" },
                    { href: "/list?cat=baby-cares", label: "Baby Essentials" },
                    {
                      href: "/list?cat=bath-care",
                      label: "Bath Care & Accessories",
                    },
                    { href: "/list?cat=baby-clothing", label: "Baby Clothing" },
                    {
                      href: "/list?cat=feeding-mealtime",
                      label: "Feeding & Mealtime",
                    },
                    {
                      href: "/list?cat=safety-comfort",
                      label: "Safety & Comfort",
                    },
                    {
                      href: "/list?cat=toys-games",
                      label: "Toys Plush & Games",
                    },
                    {
                      href: "/list?cat=nursery-decor",
                      label: "Nursery & Lighting",
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
                    { href: "/order-tracking", label: "Order Tracking" },
                    { href: "/customer-service", label: "Customer Service" },
                    {
                      href: "/shipping-restrictions",
                      label: "Shipping Restrictionss",
                    },
                    { href: "/return-policy", label: "Return Policy" },
                    {
                      href: "/affiliate-program",
                      label: "Become an Affiliate",
                    },
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
              {[
                "paypal",
                "mastercard",
                "visa",
                "american-express",
                "discover",
              ].map((payment) => (
                <Image
                  key={payment}
                  src={`/${payment}.png`}
                  alt={payment}
                  width={35}
                  height={35}
                  className="transition-transform hover:scale-110 w-auto h-auto"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-sky-200 pt-4 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className="mb-2 sm:mb-0">
            &copy; 2026 MishBaby. All rights reserved.
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
