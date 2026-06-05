"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import i18n from "@/i18n";

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages = useMemo(
    () => [
      { code: "en", labelKey: "language.english" },
      { code: "ru", labelKey: "language.russian" },
      { code: "uz", labelKey: "language.uzbek" },
    ],
    []
  );

  const currentLang = (i18n.language || "en").toLowerCase();
  const currentCode = currentLang.startsWith("ru")
    ? "ru"
    : currentLang.startsWith("uz")
    ? "uz"
    : "en";

  const currentLabel = t(
    languages.find((l) => l.code === currentCode)?.labelKey ||
      "language.english"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-7xl mx-auto flex justify-between items-center mt-6 mb-6 max-xl:px-8"
    >
      <Link href={"/"}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image src={"/icon/logonew.svg"} width={157} height={44} alt="Logo" />
        </motion.div>
      </Link>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-[120] flex justify-center items-center flex-col"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 select-none"
        >
          <Image src={"/icon/Globe.svg"} width={24} height={24} alt="Globe" />
          <span className="text-[14px] font-semibold text-[#1E2939]">
            {currentLabel}
          </span>
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 min-w-[180px] rounded-[16px] bg-white shadow-lg border border-[#E5E7EB] overflow-hidden z-[9999]"
            >
              <div className="px-4 py-3 text-[12px] font-medium text-[#6A7282]">
                {t("navbar.chooseLanguage")}
              </div>
              <div className="flex flex-col">
                {languages.map((lang) => {
                  const label = t(lang.labelKey);
                  const active = lang.code === currentCode;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setOpen(false);
                      }}
                      className={[
                        "px-4 py-3 text-left text-[14px] font-medium",
                        active
                          ? "bg-[#F3F4F6] text-[#1E2939]"
                          : "bg-white text-[#1E2939]",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
