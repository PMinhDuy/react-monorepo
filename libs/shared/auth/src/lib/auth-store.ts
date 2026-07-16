import { create } from 'zustand'

export type UserRole = 'ADMIN' | 'USER'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  isInitialized: boolean
  setAuth: (accessToken: string, refreshToken: string, user: AuthUser) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: AuthUser | null) => void
  setInitialized: (initialized: boolean) => void
  clearAuth: () => void
}

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('user_profile')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  user: getStoredUser(),
  isInitialized: false,
  setAuth: (accessToken, refreshToken, user) => {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    localStorage.setItem('user_id', user.id)
    localStorage.setItem('user_profile', JSON.stringify(user))
    set({ accessToken, refreshToken, user, isInitialized: true })
  },
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    set({ accessToken, refreshToken })
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user_profile', JSON.stringify(user))
    } else {
      localStorage.removeItem('user_profile')
    }
    set({ user })
  },
  setInitialized: (initialized) => {
    set({ isInitialized: initialized })
  },
  clearAuth: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_profile')
    set({ accessToken: null, refreshToken: null, user: null, isInitialized: true })
  },
}))

if (typeof window !== 'undefined') {
  window.addEventListener('auth:tokens-updated', (event: Event) => {
    const customEvent = event as CustomEvent<{ accessToken: string; refreshToken: string }>
    if (customEvent.detail) {
      useAuthStore.getState().setTokens(customEvent.detail.accessToken, customEvent.detail.refreshToken)
    }
  })

  window.addEventListener('auth:cleared', () => {
    useAuthStore.getState().clearAuth()
  })
}
