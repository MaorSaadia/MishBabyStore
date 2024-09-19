import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="border-sky-200 py-8 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 bg-sky-100 text-sm mt-14">
      {/* TOP */}
      <div className="flex flex-col md:flex-row justify-between gap-8">
        {/* LEFT */}
        <div className="w-full md:w-1/4 lg:w-1/5 flex flex-col gap-4">
          <Image src="/mb-logo.png" alt="logo" width={120} height={120} />
          <span className="font-semibold">MishBabySupport@gmail.com</span>
          <div className="flex gap-6">
            <Image src="/facebook.png" alt="" width={16} height={16} />
            <Image src="/instagram.png" alt="" width={16} height={16} />
            <Image src="/youtube.png" alt="" width={16} height={16} />
            <Image src="/pinterest.png" alt="" width={16} height={16} />
            <Image src="/x.png" alt="" width={16} height={16} />
          </div>
        </div>
        {/* CENTER */}
        <div className="flex flex-row justify-stretch gap-12">
          <div className="flex flex-col justify-between md:mb-24">
            <h1 className="font-medium text-lg text-cyan-600">SHOP</h1>
            <div className="flex flex-col gap-4 mt-3">
              <Link href="">All Products</Link>
              <Link href="">New Arrivals</Link>
              <Link href="">Deals</Link>
              {/* <Link href="">Baby Clothing</Link>
              <Link href="">Games</Link>
              <Link href="">Toys</Link>
              <Link href="">Rome Design</Link> */}
            </div>
          </div>
          <div className="flex flex-col justify-between md:mb-24">
            <h1 className="font-medium text-lg text-cyan-600">HELP</h1>
            <div className="flex flex-col gap-4 mt-3">
              <Link href="">Contact Us</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="">Customer Service</Link>
              <Link href="">My Account</Link>
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full md:w-1/4 flex flex-col gap-6">
          {/* <h1 className="font-medium text-lg text-cyan-600">SUBSCRIBE</h1>
          <p>
            Be the first to get the latest news about trends, promotions, and
            much more!
          </p>
          <div className="flex">
            <input
              type="text"
              placeholder="Email address"
              className="p-4 w-2/4 md:w-3/4"
            />
            <button className="w-1/4 bg-cyan-600 text-white">JOIN</button>
          </div> */}
          <span className="font-semibold text-cyan-600 text-center">
            Secure Payments
          </span>
          <div className="flex justify-evenly mb-6">
            <Image src="/paypal.png" alt="" width={40} height={20} />
            <Image src="/mastercard.png" alt="" width={40} height={20} />
            <Image src="/visa.png" alt="" width={40} height={20} />
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      {/* <div className="items-center gap-6 max-sm:mt-12">
        <div className="text-xl items-center">© 2024 MishBaby</div>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="">
            <span className="text-gray-500 mr-4">Language</span>
            <span className="font-medium">United States | English</span>
          </div>
          <div className="">
            <span className="text-gray-500 mr-4">Currency</span>
            <span className="font-medium">$ USD</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Footer;
