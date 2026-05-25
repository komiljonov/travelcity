import api from "@/lib/axios";
import { IConfig } from "@type/config";

export const getConfig = async (): Promise<IConfig> => {
  const { data } = await api.get(`/v1/config`);
  return data;
};
