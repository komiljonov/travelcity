import InfoSection from "@/components/check/check-box";
import YouMightAlsoLike from "@/components/details/detail-card";
import { getTourDetails } from "@/lib/api/tours";
import { notFound } from "next/navigation";

export default async function CheckPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = await params;
  if (slug == undefined) return notFound();

  const tour = await getTourDetails(slug);
  if (!tour) return notFound();

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-4 sm:px-5 md:px-6 lg:px-8">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <InfoSection tour={tour} />
        <YouMightAlsoLike tour={tour} />
      </div>
    </div>
  );
}
