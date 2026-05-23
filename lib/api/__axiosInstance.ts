// import axios, { type AxiosRequestConfig } from 'axios'

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

// export async function getData<T>(
//   url: string,
//   params?: Record<string, unknown>,
//   config?: AxiosRequestConfig
// ): Promise<T> {
//   const res = await axiosInstance.get<T>(url, { ...config, params })
//   return res.data
// }

// export async function postData<T>(
//   url: string,
//   data?: unknown,
//   config?: AxiosRequestConfig
// ): Promise<T> {
//   const res = await axiosInstance.post<T>(url, data, config)
//   return res.data
// }

// export default axiosInstance

