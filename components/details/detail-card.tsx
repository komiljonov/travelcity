"use client";

import { ITour } from "@type/tour";
import FeatureCard from "../ui/featurecard";
import { useTranslation } from "react-i18next";

export default function DetailCard({ tour }: { tour: ITour }) {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl m-auto w-full min-w-0">
      <div className="mt-24">
        <h1 className="font-bold text-[36px] leading-[44px] tracking-[-0.02em] max-md:text-[26px] max-md:leading-[34px]">
          {t("tour.you_might_like")}
        </h1>
        <p className=" font-medium text-[#6A7282] mt-2 text-[14px] max-md:text-[13px]">
          {t("tour.you_might_like_desc")}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8 mt-6 max-md:flex max-md:flex-col max-md:items-stretch">
        {tour.recommended_tours.map((c) => (
          <FeatureCard key={c.id} tour={c} />
        ))}
      </div>
    </div>
  );
}
