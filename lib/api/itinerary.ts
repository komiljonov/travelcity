import api from "@/lib/axios";
import { IItinerary } from "@type/itinerary";

export const getTourItinerary = async (
  tour: number | string
): Promise<IItinerary[]> => {
  const { data } = await api.get(`/v1/itinerary/?tour=${tour}`);
  return data;
};
