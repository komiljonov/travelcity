import CheckBox from "@/components/check/check-box";
import DetailCard from "@/components/details/detail-card";
import { getCityBySlug } from "@/lib/cities";
import { notFound } from "next/navigation";

export default function CheckPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const city = getCityBySlug(params.slug);
  if (!city) return notFound();

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-4 sm:px-5 md:px-6 lg:px-8">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <CheckBox city={city} />
        <DetailCard tour={city} />
      </div>
    </div>
  );
}
