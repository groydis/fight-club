import type { UseFetchOptions } from "nuxt/app"

export function useCustomFetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {},
) {
    const token = useSupabaseToken()
    const headers = {
    ...(options.headers || {}),
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    }
  console.log(headers)
  return useFetch(url, {
  method: options.method || 'GET',
    body: options.body,
    query: options.query,   
    headers,
    baseURL: process.env.BACKEND_URL || 'http://localhost:8008',
  })
}
