import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface UserProfile {
  id: string
  name: string
  username: string
  bio?: string
  email: string
  avatarUrl?: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const router = useRouter()

  const setUser = async (data: UserProfile) =>  {
      user.value = data;
  }

  const fetchUser = async () => {
    loading.value = true
    error.value = null
    try {
      const { execute, data, error } = await useCustomFetch<{ user: UserProfile }>('/api/user')
      
      await execute()
      if (error.value) throw error.value;

      user.value = data.value.user as UserProfile
    } catch (err: unknown) {
      console.error('Failed to load user', err)
      error.value = err
      router.push('/auth?view=login')
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (fields: { username: string; bio?: string }) => {
    try {
      loading.value = true
      if (!user.value) throw new Error('No user loaded')
      const { execute, data, error } = await useCustomFetch(`/api/user`, {
        method: 'PATCH',
        body: fields,
      })

      await execute()
      if (error.value) throw error.value;

      user.value = { ...data.value, ...fields }
    } catch (err: unknown) {
        console.error('Failed to update user', err)
        error.value = err
    } finally {
      loading.value = false
    }
  }

  const uploadAvatar = async (file: File) => {
    try {
      loading.value = true
      if (!user.value) throw new Error('No user loaded')
      const formData = new FormData()
      formData.append('avatar', file)
      const { execute, data, error } = await useCustomFetch<{ avatarUrl: string }>(`/api/user/avatar`, {
        method: 'POST',
        body: formData,
      })
      await execute()
      if (error.value) throw error.value;
      user.value.avatarUrl = data.avatarUrl
    } catch (err: unknown) {
      console.error('Failed to upload user avatar', err)
      error.value = err
    }
  }

  const deleteAccount = async () => {
    if (!user.value) throw new Error('No user loaded')
    await $fetch(`/api/user/${user.value.id}`, { method: 'DELETE' })
    user.value = null
    router.push('/')
  }

  return {
    user,
    loading,
    error,
    setUser,
    fetchUser,
    updateProfile,
    uploadAvatar,
    deleteAccount,
  }
})
