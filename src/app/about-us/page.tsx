"use client";

import { motion } from "framer-motion";
import { Heart, Clock, Gift, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  const features = [
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Made with Love",
      description: "Every product is chosen with care and attention to detail",
    },
    {
      icon: <Clock className="w-8 h-8 text-cyan-500" />,
      title: "24/7 Support",
      description:
        "From 24/7 customer service to our hassle-free return policy",
    },
    {
      icon: <Gift className="w-8 h-8 text-purple-500" />,
      title: "Premium Quality",
      description: "Carefully curated products from trusted brands",
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Safe & Secure",
      description: "All products meet or exceed safety standards",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-200 to-sky-100 px-4 sm:px-6 lg:px-8 -mb-12 mt-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto py-8"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-600 m-4">
            Welcome to MishBaby
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Creating magical moments for your little ones with premium baby
            products
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative w-full h-64 sm:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 -mt-8">
              <Image
                src="/about-us.png"
                alt="about-us"
                fill
                className="rounded-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <p className="text-gray-700 text-lg leading-relaxed">
                At MishBaby, we&apos;re dedicated to making parenting a
                delightful journey. We understand that every baby is unique, and
                we&apos;re passionate about bringing you products that make your
                little one feel safe, comfortable, and cherished.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold text-cyan-600 mb-4">
                Our Promise to You
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                From premium clothing to innovative baby gear, each item in our
                collection is thoughtfully selected to support your baby&apos;s
                growth and development. We believe in creating a world where
                every parent feels confident and supported.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Join thousands of happy parents who trust MishBaby for their little
            ones needs. We&apos;re constantly expanding our collection to bring
            you the very best in baby care.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/list?cat=all-products" passHref>
              <button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Explore Our Products
              </button>
            </Link>
            <Link href="/customer-service" passHref>
              <button className="w-full sm:w-auto bg-white text-cyan-600 border-2 border-cyan-500 font-bold py-4 px-8 rounded-full transition duration-300 text-lg hover:bg-cyan-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Contact Support
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
      <hr className="border-slate-400" />
    </div>
  );
};

export default AboutUs;
