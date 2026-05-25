import api from "@/lib/axios";
import { IMedia } from "@type/media";
import { IPagination } from "@type/pagination";

export const getTourMedia = async (
  tour: number | string
): Promise<IPagination<IMedia>> => {
  const { data } = await api.get(`/v1/media/?tour=${tour}`);
  return data;
};

export const getAllMedia = async (): Promise<IMedia[]> => {
  const { data } = await api.get(`/v1/media/`);
  return data;
};

export async function getMedia(page: number, pageSize = 20) {
  const { data } = await api.get(
    `/v1/media/?page=${page}&page_size=${pageSize}`
  );

  return data as Promise<{
    results: { media: string }[];
    count: number;
    next: string | null;
  }>;
}
