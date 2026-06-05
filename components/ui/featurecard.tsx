"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ITour } from "@type/tour";
import { useTranslation } from "react-i18next";
import { getField } from "@/lib/utils/i18n";

export default function FeatureCard({ tour }: { tour: ITour }) {
  const { t } = useTranslation();
  return (
    <Link href={`/tours/${tour.id}`}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          },
        }}
        className="travel-feature-card border-[2px] border-neutral-100 max-w-full rounded-[20px] bg-white cursor-pointer overflow-hidden max-md:w-[330px]"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={tour.image}
            className="rounded-b-[22px] w-full object-cover h-[220px]"
            width={305}
            height={228}
            alt={tour.name}
          />

        </motion.div>
        <div className="p-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            // className="font-semibold text-[15px] text-[#1E2939] mb-2 line-clamp-2 min-h-[54px] [font-size:clamp(13px,1.5vw,15px)]"
            className="font-semibold text-[15px] text-[#1E2939] mb-2 line-clamp-2 min-h-[48px]"
          >
            {getField(tour, "name")}
          </motion.h1>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="font-medium text-[12px] text-[#6A7282]">
              {t("price.from")}
            </p>
            <p className="text-[#EA004A] text-[18px] font-bold">
              ${tour.price_starting}
            </p>
          </motion.span>
        </div>
      </motion.div>
    </Link>
  );
}
