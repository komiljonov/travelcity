// import Recomedtion from "@/components/citys/Recomedtion";
import TourHero from "@/components/citys/tourhero";
import { getCityDetail } from "@/lib/api/city";
import { notFound } from "next/navigation";

export default async function pagee({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = await params;

  const city = await getCityDetail(slug);

  if (!city) return notFound();


  return (
    <div>
      <TourHero city={city} />
      {/* <Recomedtion /> */}
    </div>
  );
}
