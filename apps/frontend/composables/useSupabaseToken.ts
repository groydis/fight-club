export function useSupabaseToken() {
  const token = useState<string | null>('supabase-token', () => null)
  const supabase = useSupabaseClient()

  if (!token.value) {
    supabase.auth.getSession().then(({ data }) => {
      token.value = data.session?.access_token || null
    })
  }
  return token
}
