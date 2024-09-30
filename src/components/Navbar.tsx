import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import Menu from "./Menu";
import SearchBar from "./SearchBar";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = () => {
  return (
    <nav className="h-20 px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-32 relative">
      {/* Mobile and Tablet */}
      <div className="h-full flex items-center justify-between lg:hidden">
        <Link href="/" className="flex items-center">
          <Image
            src="/mb-logo.png"
            alt="MishBaby Logo"
            width={40}
            height={40}
          />
          <span className="ml-2 text-xl font-semibold">MishBaby</span>
        </Link>
        <div className="flex items-center gap-4">
          <SearchBar />
          <NavIcons />
          <Menu />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex items-center justify-between h-full">
        {/* Left side */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/mb-logo.png"
              alt="MishBaby Logo"
              width={50}
              height={50}
            />
            <span className="ml-2 text-2xl font-semibold">MishBaby</span>
          </Link>
          <div className="hidden xl:flex gap-6 text-sm">
            <Link
              href="/list?cat=all-products&filter=Sale"
              className="hover:text-cyan-600 transition-colors"
            >
              Deals
            </Link>
            <Link
              href="/list?cat=all-products&filter=New Arrival"
              className="hover:text-cyan-600 transition-colors"
            >
              New Arrival
            </Link>
            <Link
              href="/customer-service"
              className="hover:text-cyan-600 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-8">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
