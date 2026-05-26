"use client";
// import { cities } from "@/lib/cities";
import { motion } from "framer-motion";
// import FeatureCard from "../ui/featurecard";

export default function Recomedtion() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="max-md:px-4 max-w-7xl m-auto">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-8 mb-8 max-md:mt-4 max-md:mb-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-[36px] font-bold">
            Recommended Tours
          </h1>

          <p className="font-medium text-[#6A7282] mt-2 text-sm md:text-base">
            Explore the Uzbekistan`s most iconic cities and hidden gems
          </p>
        </div>

        <div
          className="
        mt-6
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-5
      "
        >
        </div>
      </motion.div>
    </div>
  );
}
