"use client";

import { motion } from "framer-motion";
import FeatureCard from "../ui/featurecard";

import { getFeaturedTours } from "@/lib/api/tours";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export default function FeaturedSection() {
  const { t } = useTranslation();

  const { data } = useQuery({
    queryKey: ["featured_tours"],
    queryFn: getFeaturedTours,
  });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="max-w-7xl m-auto mt-[64px] max-md:px-4" id="featured_tours">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-[36px] font-bold max-md:text-[26px]">
          {t("home.featured_tours")}
        </h1>
        <p className="font-medium text-[#6A7282] mt-2 text-[14px] max-md:text-[13px]">
          {/* Explore the Uzbekistan`s most iconic cities and hidden gems */}
          {t("home.featured_tours_description")}
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        className="mt-6 grid grid-cols-4 gap-5 max-md:flex max-md:flex-col max-md:w-full"
        variants={containerVariants}
        initial="visible"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {data?.map((tour) => {
          return (
            <motion.div key={tour.id} variants={cardVariants}>
              <FeatureCard tour={tour} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
