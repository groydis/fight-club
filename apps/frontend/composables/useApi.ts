import type { UseFetchOptions } from "nuxt/app"

export async function useCustomFetch<TResponse, TBody = unknown>(
  url: string | (() => string),
  options: UseFetchOptions<TResponse> & { body?: TBody } = {},
) {
  const supabase = useSupabaseClient()
  const { data } = await supabase.auth.getSession()

  const token = data.session?.access_token

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  return useFetch<TResponse>(url, {
    method: options.method || 'GET',
    body: options.body,
    query: options.query,
    credentials: 'include',
    headers,
    baseURL: process.env.BACKEND_URL || 'http://localhost:8008',
    immediate: false,
    watch: false,
  })
}
