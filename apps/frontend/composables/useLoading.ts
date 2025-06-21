export const useLoading = () => {
  const loading = useState<boolean>('global-loading', () => false)

  const showLoading = () => {
    console.log('[useLoading] SHOW')
    loading.value = true
  }

  const hideLoading = () => {
    console.log('[useLoading] HIDE')
    loading.value = false
  }

  return { loading, showLoading, hideLoading }
}