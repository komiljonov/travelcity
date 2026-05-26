"use client";
import Image from "next/image";
import { ITour } from "@type/tour";
import { useTranslation } from "react-i18next";
import { getField } from "@/lib/utils/i18n";

export default function Cheack({ tour }: { tour: ITour }) {
  const { t } = useTranslation();
  return (
    <div className="w-full min-w-0">
      <div className="max-w-7xl m-auto w-full min-w-0 mb-6 mt-10">
        <div className="w-full max-w-[767px] bg-[#E5E7EB] h-[2px]"></div>
      </div>
      <div className=" max-w-7xl m-auto w-full min-w-0 flex gap-[86px] max-md:flex-col max-md:gap-6  ">
        <div>
          <h1 className="font-bold text-[18px] leading-7 tracking-[0%]">
            {t("tour.includes")}
          </h1>
        </div>
        <div className="flex flex-col gap-3 ">
          {getField(tour, "includes")
            .split("\n")
            .filter(Boolean)
            .map((line, idx) => {
              const isExclude = line.trimStart().startsWith("-");
              const displayText = isExclude
                ? line.trimStart().slice(1).trimStart()
                : line.trimStart();

              return (
                <span key={idx} className="flex gap-2">
                  <Image
                    src={isExclude ? "/icon/X.svg" : "/icon/Check.svg"}
                    width={24}
                    height={24}
                    alt="?"
                  />
                  <p className="font-medium text-[16px] leading-6 tracking-[0%]">
                    {displayText}
                  </p>
                </span>
              );
            })}
        </div>
      </div>
      <div className="max-w-7xl m-auto mb-6 mt-10">
        <div className="w-full max-w-[767px] bg-[#E5E7EB] h-[2px]"></div>
      </div>
      <div>
        <div className=" max-w-7xl m-auto w-full min-w-0 flex gap-[86px] max-md:flex-col max-md:gap-6  ">
          <div>
            <h1 className="font-bold text-[18px] leading-7 tracking-[0%]">
              {t("tour.highlights")}
            </h1>
          </div>
          <div>
            <ul className="list-disc flex flex-col gap-3 max-md:pl-4">
              {getField(tour, "highlights")
                .split("\n")
                .map((h, idx) => (
                  <li
                    key={idx}
                    className="font-medium text-[16px] leading-6 tracking-normal"
                  >
                    {h}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl m-auto mb-6 mt-10">
        <div className="w-full max-w-[767px] bg-[#E5E7EB] h-[2px]"></div>
      </div>
    </div>
  );
}
