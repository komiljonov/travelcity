import Image from "next/image";
import { ITariff } from "@type/tariff";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { calculate } from "@/lib/utils/calculate";
import { AnimatePresence } from "framer-motion";
import { ITour } from "@type/tour";
import BookModal from "./bookModel";
import { getField } from "@/lib/utils/i18n";
import { useTranslation } from "react-i18next";

type FormValues = {
  date: Date | null;
  adult: number;
  child: number;
  infant: number;
  language: string;
};

export default function Tariff({
  tour,
  tariff,
}: {
  tour: ITour;
  tariff: ITariff;
}) {
  const { t } = useTranslation();
  const [showBookModal, setShowBookModal] = useState(false);

  const { watch } = useFormContext<FormValues>();

  const date = watch("date");
  const adults = watch("adult");
  const child = watch("child");
  const infants = watch("infant");
  const language = watch("language");

  const price = useMemo(
    () =>
      calculate(tariff.price_formula, {
        adults,
        children: child,
        infants,
      }),
    [adults, child, infants, tariff]
  );


  return (
    <>
      <div className="bg-[#F3F4F6] p-5 rounded-[24px]">
        <h2 className="text-[#1E2939] text-[20px] font-semibold mb-px">
          {getField(tariff, "name")}
        </h2>
        <p className="text-[#6A7282] font-medium mb-6 text-sm">
          {getField(tariff, "description")}
        </p>

        {getField(tariff, "includes")
          .split("\n")
          .filter(Boolean)
          .map((line, i) => {
            const isExclude = line.trimStart().startsWith("-");
            const displayText = isExclude
              ? line.trimStart().slice(1).trimStart()
              : line.trimStart();

            return (
              <div key={i} className="flex gap-x-2 items-center mb-3">
                <Image
                  src={isExclude ? "/icon/X.svg" : "/icon/Check.svg"}
                  width={24}
                  height={24}
                  alt=""
                />
                <span className="text-[#1E2939] font-medium text-lg">
                  {displayText}
                </span>
              </div>
            );
          })}

        <div className="flex flex-wrap mt-6 justify-between items-center gap-4">
          <div className="flex flex-col">
            <p className="text-[#EA004A] font-bold text-[24px]">${price}</p>
          </div>
          <button
            onClick={() => setShowBookModal(true)}
            className="bg-[#EA004A] text-white font-bold py-3 px-6 rounded-[100px] text-sm whitespace-nowrap transition-colors
    hover:bg-[#d30042]
    disabled:bg-[#f5a0bb] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={
              !(
                adults + child + infants > 0 &&
                date != null &&
                language != null
              )
            }
          >
            {t("check.tariff.select_this_option")}
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showBookModal && (
          <BookModal
            tariff={tariff}
            tour={tour}
            onClose={() => setShowBookModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
