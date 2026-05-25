import FeaturedSection from "@/components/home/featured-section";
import Gallery from "@/components/home/gallery";
import Hero from "@/components/home/hero";
import TourCity from "@/components/home/tour-city";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <FeaturedSection />
      <TourCity />
      <Gallery />
    </div>
  );
}
