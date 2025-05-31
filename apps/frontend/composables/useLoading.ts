export const useLoading = () => {
  const loading = useState<boolean>('globalLoading', () => false)
  const showLoading = () => (loading.value = true)
  const hideLoading = () => (loading.value = false)
  return { loading, showLoading, hideLoading }
}
