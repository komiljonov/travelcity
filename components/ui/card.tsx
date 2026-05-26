"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { City } from "@/lib/cities";
import { useTranslation } from "react-i18next";
import { getField } from "@/lib/utils/i18n";

export default function Card({ city }: { city: City }) {
  const { t } = useTranslation();

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const toursText = `${city.name}: tours available`;

  return (
    <Link href={`/tours/${city.slug}`}>
      <div className="">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="travel-city-card relative overflow-hidden rounded-[24px] cursor-pointer group"
          style={{ width: `305px`, height: "220px" }}
        >
          <Image
            src={city.galleryImages[1] || city.galleryImages[0]}
            alt={city.name}
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/60 transform transition-transform duration-700 group-hover:-translate-y-full">
            <h1 className="text-white text-center font-bold mb-1 text-[24px] leading-[32px]">
              {getField(city, "name")}
            </h1>

            <p className="text-white text-center font-medium text-[14px] leading-[20px]">
              {toursText}
            </p>
          </div>
        </motion.div>
      </div>
    </Link>
  );
}
