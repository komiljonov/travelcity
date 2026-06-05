"use client";

import Image from "next/image";
import { ITour } from "@type/tour";
import { getTourFeedbacks } from "@/lib/api/feedback";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export default function Feedbacks({ tour }: { tour: ITour }) {
  const { t } = useTranslation();

  // const feedbacks = await getTourFeedbacks(tour.id);

  // if (!feedbacks) return notFound();

  const { data: feedbacks } = useQuery({
    queryKey: ["feedbacks", tour.id],
    queryFn: () => getTourFeedbacks(tour.id),
  });

  return (
    <div className="max-w-7xl m-auto w-full min-w-0">
      <h1 className="font-bold text-[24px] leading-8 tracking-normal mt-10 mb-6 max-md:text-[18px]">
        {t("feedbacks")}
      </h1>

      {feedbacks?.results && feedbacks.results.length === 0 && (
        <p className="text-[#6A7282] text-[16px]">{t("no_feedbacks_yet")}</p>
      )}

      {feedbacks?.results.map((fb, idx) => {
        // const avatarSrc = fb.media?.[0]?.media || "/person.png";
        const avatarSrc = fb.consumer_image;
        const gallery = fb.media || [];
        return (
          <div
            key={idx}
            className={`w-full max-w-[847px] ${
              idx === 0 ? "p-5" : "mt-4 p-5"
            } rounded-[24px] bg-[#F3F4F6]`}
          >
            <div className=" flex gap-3">
              <Image
                src={avatarSrc}
                className="w-[50px] h-[50px] rounded-full object-cover flex-none"
                width={50}
                height={50}
                alt="avatar"
              />
              <span>
                <h1 className="font-semibold text-[#1E2939] text-[16px]">
                  {fb.consumer_name}
                </h1>
                <p className="text-[#6A7282] text-[14px]">{fb.feedback_date}</p>
              </span>
            </div>
            <p className="text-[#1E2939] mt-4 text-[16px]">{fb.comment}</p>

            {gallery.length > 0 && (
              <div className="mt-4 flex gap-3">
                {gallery.map((src, i) => (
                  <Image
                    key={i}
                    src={src.media}
                    width={106}
                    height={80}
                    className="rounded-[12px]"
                    alt="feedback photo"
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
