import CityDetailWidget from "@/components/details/city-detail-widget";
import { notFound } from "next/navigation";
// import { getCityBySlug } from "@/lib/cities";
import TextSectiona from "@/components/details/text-sectiona";
import Itinerary from "@/components/details/Itinerary";
// import { useQuery } from "@tanstack/react-query";

import { getTourDetails } from "@/lib/api/tours";
import Cheack from "@/components/details/cheack";
import DetailCard from "@/components/details/detail-card";
import Feedbacks from "@/components/details/Feedbacks";

export default async function CityDetailPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = await params;

  const tour = await getTourDetails(slug);

  if (!tour) return notFound();

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-4 sm:px-5 md:px-6 lg:px-8">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <CityDetailWidget tour={tour} />
        <TextSectiona tour={tour} />
        <Itinerary tour={tour} />
        <Cheack tour={tour} />
        <Feedbacks tour={tour} />
        <DetailCard tour={tour} />
      </div>
    </div>
  );
}
