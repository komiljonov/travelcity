import Image from "next/image";
import { ITariff } from "@type/tariff";

export default function Tariff({ tariff }: { tariff: ITariff }) {
  return (
    <div className="bg-[#F3F4F6] p-5 rounded-[24px]">
      <h2 className="text-[#1E2939] text-[20px] font-semibold mb-px">
        {tariff.name}
      </h2>
      <p className="text-[#6A7282] font-medium mb-6 text-sm">
        {tariff.description}
      </p>

      {tariff.includes
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
              <span className="text-[#1E2939] font-medium text-sm">
                {displayText}
              </span>
            </div>
          );
        })}

      <div className="flex flex-wrap mt-6 justify-between items-center gap-4">
        <div className="flex flex-col">
          <p className="text-[#EA004A] font-bold text-[24px]">1,000,000 UZS</p>
          <p className="text-[#6A7282] font-medium text-[16px] mt-[-8px] line-through">
            1,500,000 UZS
          </p>
        </div>
        <button
          //   onClick={() => setShowBookModal(true)}
          className="bg-[#EA004A] text-white cursor-pointer font-bold py-3 px-6 rounded-[100px] hover:bg-[#d30042] transition-colors text-sm whitespace-nowrap"
        >
          Select this option
        </button>
      </div>
    </div>
  );
}
