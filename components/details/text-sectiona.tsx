"use client";

import { getField } from "@/lib/utils/i18n";
import { ITour } from "@type/tour";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function TextSectiona({ tour }: { tour: ITour }) {
  const { t } = useTranslation();
  return (
    <div className="w-full min-w-0">
      <div className="max-w-7xl m-auto w-full min-w-0">
        <div>
          <h1 className="font-bold mt-10 text-[24px] leading-[32px] tracking-[0px] max-md:text-[18px]">
            {t("description")}
          </h1>
          <p className="text-[#6A7282] font-medium text-[16px] leading-[24px] tracking-[0px] w-full max-w-[847px] mt-6 max-md:text-[14px]">
            {getField(tour, "description")}
          </p>
        </div>
        <div>
          <h2 className="font-bold mt-10 text-[24px] leading-[32px] tracking-[0px] max-md:text-[18px]">
            {/* About this activity */}
            {t("tour.about_this_activity")}
          </h2>
          <div>
            {/* {tour.aboutActivity.map((item, idx) => (
                          <div key={idx} className='mt-6 flex   gap-3 items-start'>
                            <Image src={item.iconSrc} width={24} height={24} alt='a' />
                            <span>
                                <h1 className='font-semibold text-[18px] leading-[28px] tracking-[0px]'>
                                  {item.title}
                                </h1>
                                <p className='text-[#6A7282] font-medium text-[16px] leading-[24px] tracking-[0px] mt-2'>
                                  {item.text}
                                </p>
                            </span>
                          </div>
                        ))} */}

            {/* Free cancellation */}
            <div className="mt-6 flex   gap-3 items-start">
              <Image src={"/icon/svg1.svg"} width={24} height={24} alt="a" />
              <span>
                <h1 className="font-semibold text-[18px] leading-[28px] tracking-[0px]">
                  {/* Free cancellation */}
                  {t("tour.free_cancellation")}
                </h1>
                <p className="text-[#6A7282] font-medium text-[16px] leading-[24px] tracking-[0px] mt-2">
                  {/* Cancel up to 24 hours in advance for a full refund */}
                  {t("tour.free_cancellation_desc")}
                </p>
              </span>
            </div>

            {/* Host or greeter */}
            <div className="mt-6 flex   gap-3 items-start">
              <Image src={"/icon/svg2.svg"} width={24} height={24} alt="a" />
              <span>
                <h1 className="font-semibold text-[18px] leading-[28px] tracking-[0px]">
                  {/* Host or greeter */}
                  {t("tour.host_or_greeter")}
                </h1>
                <p className="text-[#6A7282] font-medium text-[16px] leading-[24px] tracking-[0px] mt-2">
                  {/* English, French, Spanish, German, Korean, Japanese, Russian q */}
                  {tour.languages?.map((l) => l.name).join(", ")}
                </p>
              </span>
            </div>

            {/* Duration */}
            <div className="mt-6 flex   gap-3 items-start">
              <Image src={"/icon/svg3.svg"} width={24} height={24} alt="a" />
              <span>
                <h1 className="font-semibold text-[18px] leading-[28px] tracking-[0px]">
                  {t("duration")}: {tour.duration_title}
                </h1>
                <p className="text-[#6A7282] font-medium text-[16px] leading-[24px] tracking-[0px] mt-2">
                  {/* Check availability to see starting times */}
                  {t("duration_desc")}
                </p>
              </span>
            </div>

            {/*  */}
          </div>
        </div>
      </div>
    </div>
  );
}
