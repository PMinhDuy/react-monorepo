import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  userId: string | null
  setAuth: (token: string, userId: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('access_token'),
  userId: localStorage.getItem('user_id'),
  setAuth: (token, userId) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('user_id', userId)
    set({ accessToken: token, userId })
  },
  clearAuth: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    set({ accessToken: null, userId: null })
  },
}))
