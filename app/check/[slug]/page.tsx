import CheckBox from "@/components/check/check-box";
import DetailCard from "@/components/details/detail-card";
import { getTourDetails } from "@/lib/api/tours";
import { notFound } from "next/navigation";

export default async function CheckPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  // const city = getCityBySlug(params.slug);
  const { slug } = await params;
  console.log(slug);
  if (slug == undefined) return notFound();
  const tour = await getTourDetails(slug);
  if (!tour) return notFound();

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-4 sm:px-5 md:px-6 lg:px-8">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <CheckBox tour={tour} />
        <DetailCard tour={tour} />
      </div>
    </div>
  );
}
