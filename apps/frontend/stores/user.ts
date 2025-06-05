// stores/user.ts
import { defineStore } from 'pinia'

interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  status: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    data: null as null | UserProfile,
    loading: false,
  }),
  actions: {
    async setUser(user: UserProfile) {
      this.data = user
    },
    setLoading(val: boolean) {
      this.loading = val
    },
  },
})
