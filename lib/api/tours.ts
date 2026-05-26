import api from "@/lib/axios";
import { ITour } from "@type/tour";

export const getFeaturedTours = async (): Promise<ITour[]> => {
  const { data } = await api.get("/v1/tours/?featured=true");
  return data;
};

export const getTourDetails = async (id: number | string): Promise<ITour> => {
  const { data } = await api.get(`v1/tours/${id}`);

  return data;
};

export const getCityTours = async (city: number | string): Promise<ITour[]> => {
  const { data } = await api.get(`v1/tours?city=${city}`);

  return data;
};
