"use client";

import { useConfig } from "@/lib/hooks/useConfig";
import { getField } from "@/lib/utils/i18n";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  // const { data } = useQuery({
  //   queryKey: ["config"],
  //   queryFn: getConfig,
  // });

  const { data } = useConfig();

  return (
    <div
      className="relative bg-center bg-cover bg-no-repeat mt-6"
      // style={{
      //   backgroundImage: data?.home_main_image
      //     ? `url(${data.home_main_image})`
      //     : `url(/header.png)`,
      // }}

      style={{
        backgroundImage: data
          ? `url(${getField(data, "home_main_image")})`
          : `url(/header.webp)`,
      }}
    >
      <div className="max-w-7xl m-auto">
        <div className="pt-[502px] pb-20 relative z-10 max-md:pt-[260px] max-md:pb-12">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-bold text-[96px] leading-[110px] tracking-[-0.02em] text-white max-md:text-[44px] max-md:leading-[52px] max-md:px-4"
          >
            {getField(data, "home_main_title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="mt-4 font-medium text-[18px] leading-[28px] tracking-normal w-[730px] text-white max-md:w-full max-md:max-w-[730px] max-md:text-[14px] max-md:leading-[20px] max-md:px-4"
          >
            {getField(data, "home_main_description")}
          </motion.p>
          <motion.button
            onClick={() => {
              document
                .getElementById("featured_tours")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="cursor-pointer px-6 h-[48px] rounded-[100px] bg-white font-semibold text-[16px] leading-[24px] tracking-normal text-center mt-7 max-md:mx-4 max-md:w-[calc(100%-32px)]"
          >
            {t("home.hero.cta")}
          </motion.button>
        </div>
      </div>

      <motion.img
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute bottom-0 w-full"
        src="/headerdark.webp"
        alt=""
      />
    </div>
  );
}
