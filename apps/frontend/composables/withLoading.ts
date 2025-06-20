export async function withLoading<T>(fn: () => Promise<T>) {
  const { showLoading, hideLoading } = useLoading()
  try {
    showLoading()
    return await fn()
  } finally {
    hideLoading()
  }
}
