import api from "@/lib/axios";
import { IFeedback } from "@type/feedback";
import { IPagination } from "@type/pagination";

export const getTourFeedbacks = async (
  tour: number | string
): Promise<IPagination<IFeedback>> => {
  const { data } = await api.get(`/v1/feedbacks/?tour=${tour}`);
  return data;
};
