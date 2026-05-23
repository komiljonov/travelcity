import type { City } from "@/lib/cities";
import { cities } from "@/lib/cities";
import FeatureCard from "../ui/featurecard";

export default function DetailCard({ city }: { city: City }) {
  const recommended = cities.filter((c) => c.slug !== city.slug).slice(0, 4);
  return (
    <div className="max-w-7xl m-auto w-full min-w-0">
      <div className="mt-24">
        <h1 className="font-bold text-[36px] leading-[44px] tracking-[-0.02em] max-md:text-[26px] max-md:leading-[34px]">
          You might also like
        </h1>
        <p className=" font-medium text-[#6A7282] mt-2 text-[14px] max-md:text-[13px]">
          Explore The Uzbekistan`s most iconic cities and hidden gems
        </p>
      </div>
      <div className="flex justify-center gap-5 mb-8 mt-6 max-md:flex-col max-md:items-stretch">
        {recommended.map((c) => (
          <FeatureCard key={c.slug} tour={c} />
        ))}
      </div>
    </div>
  );
}
