"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-cyan-200 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto py-12 sm:py-16 lg:py-20"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-cyan-600 mb-8 lg:mb-12">
          About MishBaby
        </h1>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/api/placeholder/800/600"
                alt="Happy baby with caring parent"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-500 mb-4">
              Welcome to Our World of Baby Bliss!
            </h2>
            <p className="text-gray-700 mb-6 text-base sm:text-lg">
              At MishBaby, we&apos;re more than just an e-commerce store –
              we&apos;re your partners in parenting. Our passion is to provide
              families with a curated selection of high-quality baby products
              that ensure comfort, safety, and joy for your little ones.
            </p>
            <h3 className="text-xl sm:text-2xl font-semibold text-cyan-500 mb-4">
              Our Commitment to You
            </h3>
            <p className="text-gray-700 mb-6 text-base sm:text-lg">
              What sets MishBaby apart is our unwavering dedication to customer
              support. We understand that parenting can be challenging, and
              we&apos;re here to make your journey easier. Our team of
              experienced parents and baby product experts is always ready to
              assist you.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 text-center"
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-cyan-500 mb-4">
            Experience the MishBaby Difference
          </h3>
          <p className="text-lg sm:text-xl text-gray-700 mb-6">
            From 24/7 customer service to our hassle-free return policy, we go
            above and beyond to ensure your shopping experience is as smooth as
            your baby&apos;s skin. Our friendly support team is just a click
            away!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/" passHref>
              <button className="w-full sm:w-auto bg-sky-400 hover:bg-cyan-400 text-white font-bold py-3 px-6 rounded-full transition duration-300 text-base sm:text-lg">
                Explore Our Products
              </button>
            </Link>
            <Link href="/customer-service" passHref>
              <button className="w-full sm:w-auto bg-sky-400 hover:bg-cyan-400 text-white font-bold py-3 px-6 rounded-full transition duration-300 text-base sm:text-lg">
                Customer Support
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
