import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  const isMockMode = ref(import.meta.env.VITE_MOCK_AUTH === 'true')
  
  // Mock user data
  const MOCK_USER = {
    id: 1,
    username: "demo_user",
    email: "demo@cii.utexas.edu",
    first_name: "Demo",
    last_name: "User"
  }
  
  // Getters
  const isAuthenticated = computed(() => {
    return isMockMode.value ? true : !!token.value
  })
  
  const currentUser = computed(() => {
    return isMockMode.value ? MOCK_USER : user.value
  })
  
  // Actions
  const initializeAuth = () => {
    if (isMockMode.value) {
      user.value = MOCK_USER
      token.value = "mock_token_12345"
    } else {
      // Check for stored token and validate
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        token.value = storedToken
        // TODO: Validate token with backend
      }
    }
  }
  
  const login = () => {
    if (isMockMode.value) {
      // Mock login
      user.value = MOCK_USER
      token.value = "mock_token_12345"
      localStorage.setItem('auth_token', token.value)
    } else {
      // Redirect to Kentico SSO
      const ssoUrl = import.meta.env.VITE_KENTICO_SSO_URL
      const callbackUrl = import.meta.env.VITE_APP_CALLBACK_URL
      window.location.href = `${ssoUrl}?redirect=${encodeURIComponent(callbackUrl)}`
    }
  }
  
  const handleCallback = (jwtToken) => {
    // Handle JWT token from Kentico callback
    token.value = jwtToken
    localStorage.setItem('auth_token', jwtToken)
    
    // Decode JWT to get user info (basic decode, validation happens on backend)
    try {
      const payload = JSON.parse(atob(jwtToken.split('.')[1]))
      user.value = {
        username: payload.username,
        email: payload.email,
        first_name: payload.firstname,
        last_name: payload.lastname
      }
    } catch (error) {
      console.error('Failed to decode JWT:', error)
    }
  }
  
  const logout = () => {
    if (isMockMode.value) {
      // In mock mode, stay logged in as demo user
      return
    } else {
      user.value = null
      token.value = null
      localStorage.removeItem('auth_token')
    }
  }
  
  return {
    user,
    token,
    isMockMode,
    isAuthenticated,
    currentUser,
    initializeAuth,
    login,
    handleCallback,
    logout
  }
})