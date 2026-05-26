"use client";
import { getCities } from "@/lib/api/city";
import { useQuery } from "@tanstack/react-query";
// import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { GrFormNextLink } from "react-icons/gr";

// const cities = [
//   {
//     name: "Bukhara",
//     tours: "20+ tours available",
//     image: "/sec1.png",
//     size: "305",
//   },
//   {
//     name: "Samarkand",
//     tours: "15+ tours available",
//     image: "/sec1.png",
//     size: "305",
//   },
//   {
//     name: "Khiva",
//     tours: "10+ tours available",
//     image: "/sec1.png",
//     size: "305",
//   },
//   {
//     name: "Tashkent",
//     tours: "25+ tours available",
//     image: "/sec1.png",
//     size: "305",
//   },
//   {
//     name: "Fergana",
//     tours: "12+ tours available",
//     image: "/sec1.png",
//     size: "413",
//   },
//   {
//     name: "Shakhrisabz",
//     tours: "8+ tours available",
//     image: "/sec1.png",
//     size: "413",
//   },
//   {
//     name: "Termez",
//     tours: "5+ tours available",
//     image: "/sec1.png",
//     size: "413",
//   },
// ];

export default function TourCity() {
  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="max-w-7xl m-auto mt-16 max-md:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-[36px] font-bold max-md:text-[26px]">
          Tours by cities
        </h1>
        <p className="font-medium text-[#6A7282] mt-2 text-[14px] max-md:text-[13px]">
          Popular destinations for tourists
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-5 mt-6">
        {cities?.map((city, index) => (
          <Link key={index} href={`city-tours/${city.id}`}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className={`travel-city-card relative overflow-hidden rounded-[24px] cursor-pointer group`}
              style={{ width: `${413}px`, height: "220px" }}
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                className="object-cover"
              />
              <div className="absolute w-full h-full flex flex-col justify-center items-center bg-black/60 group-hover:-translate-y-90 duration-700">
                <h1 className="text-white text-center font-bold mb-1 text-[24px] leading-[32px] tracking-[0%] max-md:text-[20px] max-md:leading-[26px]">
                  {city.name}
                </h1>
                <p className="text-white text-center font-medium text-[14px] leading-[20px] tracking-[0%] max-md:text-[12px] max-md:leading-[16px]">
                  {city.tours_count} tours available
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="cursor-pointer w-[184px] h-[44px] items-center rounded-[12px] justify-center mt-6 bg-[#1E2939] text-white font-semibold gap-2 text-[14px] leading-[24px] tracking-[0%] flex max-md:w-full"
      >
        See All Regions <GrFormNextLink size={18} />
      </motion.button> */}
    </div>
  );
}
