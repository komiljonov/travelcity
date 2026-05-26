"use client";
import { ICity } from "@type/city";
import { getCityTours } from "@/lib/api/tours";
import { motion } from "framer-motion";
import FeatureCard from "../ui/featurecard";
import { useQuery } from "@tanstack/react-query";
import { getField } from "@/lib/utils/i18n";

export default function TourHero({ city }: { city: ICity }) {
  //   const tours = await getCityTours(city.id);

  //   if (!tours) return notFound();

  const { data: tours } = useQuery({
    queryKey: ["city-tours", city.id],
    queryFn: () => getCityTours(city.id),
  });

  if (!tours) return <>Loading...</>;

  return (
    <div>
      <div className="bg-[url(/tourhero.png)] bg-center bg-cover bg-no-repeat max-md:px-4">
        <div className="max-w-7xl m-auto pb-[81px] pt-[82px] max-md:pb-10 max-md:pt-14">
          <h1 className="font-bold text-[48px] leading-[60px] tracking-[-0.02em] text-white max-md:text-[28px] max-md:leading-[36px]">
            {getField(city, "name")}
          </h1>
          <p className="text-white mt-2 max-md:text-[13px] max-md:leading-[18px]">
            {getField(city, "description")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl m-auto max-md:px-4">
        <div className="flex flex-wrap justify-center gap-5 mt-16 mb-8 max-md:flex-col max-md:w-[330px] max-md:mx-auto">
          {tours?.map((t) => {
            return (
              <motion.div
                key={t.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                  },
                }}
              >
                <FeatureCard tour={t} />
              </motion.div>
            );
          })}

          {/* {Array.from({ length: 25 }, (_, i) => ({
            ...tours[0],
            id: i,
          })).map((t) => (
            <motion.div
              key={t.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 },
                },
              }}
            >
              <FeatureCard tour={t as unknown as ITour} />
            </motion.div>
          ))} */}
        </div>
      </div>
    </div>
  );
}
