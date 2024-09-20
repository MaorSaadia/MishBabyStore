import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import Menu from "./Menu";
import SearchBar from "./SearchBar";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = () => {
  return (
    <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between sm:hidden">
        <Link href="/" className="flex items-center">
          <Image src="/mb-logo.png" alt="" width={50} height={50} />
          <div className="hidden sm:block text-2xl tracking-wide">MishBaby</div>
        </Link>
        <div className="flex items-center gap-3">
          <SearchBar />
          <NavIcons />
          <Menu />
        </div>
      </div>
      {/* BIGGER SCREENS */}
      <div className="hidden sm:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-1">
            <Image src="/mb-logo.png" alt="" width={30} height={30} />
            <div className="text-2xl tracking-wide">MishBaby</div>
          </Link>
          <div className="hidden xl:flex gap-4">
            <Link href="/list?cat=all-products&filter=Sale">Deals</Link>
            <Link href="/">Contact</Link>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
