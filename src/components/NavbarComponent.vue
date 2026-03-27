<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import 'bootstrap/dist/css/bootstrap.min.css';

const router = useRouter();
const userStore = useUserStore();

// Reactive computed properties
const isLoggedIn = computed(() => !!userStore.user && !!userStore.user.id);
const username = computed(() => userStore.user?.username || '');

// Logout function
function logout() {
    localStorage.removeItem('token');
    userStore.unsetUser();
    router.push('/login');
}

// Navigation function
function goTo(route) {
    router.push(route);
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top">
    <div class="container-fluid px-4">
      <!-- Left: Blogs -->
      <a class="navbar-brand fw-bold" @click.prevent="goTo('/blogs')" href="#">Blogs</a>

      <!-- Right: Auth buttons -->
      <div class="d-flex ms-auto">
        <template v-if="isLoggedIn">
          <span class="me-3 align-self-center">Hello, {{ username }}</span>
          <button class="btn btn-outline-danger me-2" @click="logout">Logout</button>
        </template>
        <template v-else>
          <button class="btn btn-outline-primary me-2" @click="goTo('/login')">Login</button>
          <button class="btn btn-outline-success" @click="goTo('/register')">Register</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  height: 80px; /* increased height */
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 0 2rem; /* horizontal padding inside navbar */
}

.navbar-brand {
  font-size: 1.5rem;
  cursor: pointer;
}

.main-content {
  padding-top: 80px; /* match navbar height */
}

button {
  cursor: pointer;
  padding: 0.5rem 1rem; /* more comfortable padding for buttons */
}
</style>