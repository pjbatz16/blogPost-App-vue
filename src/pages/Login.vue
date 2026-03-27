<template>
    <form @submit.prevent="authenticate" class="container mt-5" style="max-width: 400px;">
        <h1 class="my-5 text-center">Login</h1>

        <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input 
                type="email" 
                class="form-control" 
                id="email"
                placeholder="Enter email" 
                required
                v-model="email"
            />
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input 
                type="password" 
                class="form-control" 
                id="password"
                placeholder="Password" 
                required
                v-model="password"
            />
        </div>

        <button :disabled="!isActive" type="submit" class="btn" :class="isActive ? 'btn-primary' : 'btn-danger'">
            Log In
        </button>
    </form>       
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useUserStore } from '@/stores/user';

const email = ref('');
const password = ref('');
const router = useRouter();
const notyf = new Notyf();
const userStore = useUserStore();

const isActive = computed(() => email.value !== '' && password.value !== '');

async function authenticate() {
    try {
        const response = await fetch('http://localhost:4000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value })
        });
        const data = await response.json();
        console.log("Login response:", data);

        if (data.access) {
            localStorage.setItem('token', data.access);

            // Fetch user details
            await fetchUserDetails(data.access);

            email.value = '';
            password.value = '';
            notyf.success('Successful login');

            router.push('/blogs'); // Go to blogs after login
        } else {
            notyf.error('Invalid credentials');
        }
    } catch (err) {
        console.error(err);
        notyf.error('Login failed');
    }
}

async function fetchUserDetails(token) {
    try {
        const response = await fetch('http://localhost:4000/users/details', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log("User details:", data);

        const userData = data.user || data;

        if (!userData || !userData._id) throw new Error('Invalid user data');

        // <-- Here is where you store the user in Pinia
        userStore.setUser({
            id: userData._id,
            isAdmin: !!userData.isAdmin // true if admin
        });
    } catch (err) {
        console.error(err);
        notyf.error('Failed to get user details');
    }
}
</script>