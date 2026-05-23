import api from "@/lib/axios";
import { ICity } from "@type/city";

export const getCities = async (): Promise<ICity[]> => {
  const { data } = await api.get(`/v1/cities/`);
  return data;
};
