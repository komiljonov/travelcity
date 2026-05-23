import api from "@/lib/axios";
import { IMedia } from "@type/media";

export const getTourMedia = async (
  tour: number | string
): Promise<IMedia[]> => {
  const { data } = await api.get(`/v1/media/?tour=${tour}`);
  return data;
};

export const getAllMedia = async (): Promise<IMedia[]> => {
  const { data } = await api.get(`/v1/media/`);
  return data;
};
