import api from "@/lib/axios";
import { ITariff } from "@type/tariff";

export const getTourTariffs = async (
  tour: number | string
): Promise<ITariff[]> => {
  const { data } = await api.get(`/v1/tariffs/?tour=${tour}`);
  return data;
};
