"use client";

import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaPinterestP,
  FaTelegramPlane,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useConfig } from "@/lib/hooks/useConfig";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "@/lib/api/city";
import { getField } from "@/lib/utils/i18n";

export default function Footer() {
  const { t } = useTranslation();

  const { data: config } = useConfig();

  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  });

  return (
    <div className="bg-[#1E2939] pt-6 pb-2">
      <div className="max-w-7xl m-auto w-full min-w-0 px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          <Image
            src={"/icon/footerlogo.svg"}
            width={120}
            height={44}
            alt="as"
            className="shrink-0 max-md:mx-auto"
          />
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-6 md:justify-end max-w-full min-w-0">
            {cities?.map((c) => {
              return (
                <a
                  key={c.id}
                  className="font-semibold text-[14px] sm:text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] tracking-[0%] text-[#D1D5DC] whitespace-nowrap"
                  href="#"
                >
                  {getField(c, "name")}
                </a>
              );
            })}
          </div>
          <a
            className="font-semibold text-[14px] sm:text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] tracking-[0%] text-[#D1D5DC] text-center md:text-left shrink-0"
            href="#"
          >
            {config?.phone_number}
          </a>
        </div>
        <div className="flex flex-col-reverse gap-4 items-center justify-between mt-6 pb-6 sm:flex-row sm:items-center">
          <h1 className="font-normal text-[12px] sm:text-[14px] leading-[140%] tracking-normal text-white text-center sm:text-left">
            {t("footer.copy")}
          </h1>
          <div className="flex gap-4 text-[#99A1AF] shrink-0">
            <FaTelegramPlane size={22} className="md:w-6 md:h-6" />
            <FaPinterestP size={22} className="md:w-6 md:h-6" />
            <FaInstagram size={22} className="md:w-6 md:h-6" />
            <FaFacebook size={22} className="md:w-6 md:h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
