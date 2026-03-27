<script setup>
import { onMounted, watch } from 'vue';
import { RouterView } from 'vue-router';
import { useUserStore } from '@/stores/user';

// Import your Navbar component
import NavbarComponent from '@/components/NavbarComponent.vue';

const userStore = useUserStore();

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    userStore.unsetUser();
    return;
  }

  try {
    const response = await fetch('http://localhost:4000/users/details', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Check if fetch was successful and user data exists
    if (response.ok && data.user && data.user._id) {
      userStore.setUser({
        id: data.user._id,
        username: data.user.username,
        isAdmin: data.user.isAdmin
      });
    } else {
      // Token invalid or user missing
      userStore.unsetUser();
      console.error('Failed to fetch user details:', data.message || 'Invalid token');
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    userStore.unsetUser();
  }
});

// Optional: watch user store for debugging
watch(
  () => userStore.user,
  (newUser) => {
    console.log('User state updated:', newUser);
    console.log('LocalStorage:', localStorage);
  },
  { deep: true }
);
</script>

<template>
  <!-- Navbar displayed on every page -->
  <NavbarComponent />

  <!-- Router content below navbar -->
  <div class="main-content">
    <RouterView />
  </div>
</template>

<style scoped>
.main-content {
  padding-top: 80px; /* offset for fixed navbar height */
}
</style>