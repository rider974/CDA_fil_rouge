import Image from "next/image";
import Link from "next/link";
import React from "react";

export const HeroSection = () => {
  return (
    <section className="bg-gray-900 py-14 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 space-x-20">
          <div className="md:w-1/2 mb-6 md:mb-0 text-center md:text-left ">
            <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl leading-tight mb-4">
              BeginnersAppDev Collaborative Platform
            </h1>
            <p className="text-white text-sm md:text-base lg:text-lg mb-4 lg:mb-6">
              Join BeginnersAppDev, the collaborative platform tailored for junior developers and tech enthusiasts. Stay ahead with centralized resources on programming languages and emerging technologies, engage with a vibrant community, and explore the latest trends through dynamic tools.
            </p>
            <Link
              href="/authentification/signin"
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-200 text-md"
            >
              Join Us
            </Link>
          </div>
          <div
            className="md:w-1/2 mt-6 md:mt-0"
            data-aos="fade-left"
            data-aos-duration="1000"
          >
            <Image
              src="/hero-image.jpg"
              alt="Hero image"
              width={200}
              height={200}
              className="w-3/4 rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
