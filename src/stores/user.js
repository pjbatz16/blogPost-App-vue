import { ref } from 'vue'
import { defineStore } from 'pinia'

// Unique store id
export const useUserStore = defineStore('user', () => {
  // Store multiple user properties
  const user = ref({
    id: null,
    username: null,
    isAdmin: false
  })

  // Set the user data
  function setUser(userData) {
    user.value.id = userData.id || null
    user.value.username = userData.username || null
    user.value.isAdmin = !!userData.isAdmin
  }

  // Clear user data
  function unsetUser() {
    user.value.id = null
    user.value.username = null
    user.value.isAdmin = false
    localStorage.clear()
  }

  return { user, setUser, unsetUser }
})