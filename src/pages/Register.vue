<template>
    <form @submit.prevent="register" class="container mt-5" style="max-width: 400px;">
        <h1 class="my-5 text-center">Register</h1>

        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input 
                type="text" 
                class="form-control" 
                id="username"
                placeholder="Enter username" 
                required
                v-model="username"
            />
        </div>

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

        <button 
            :disabled="!isActive" 
            type="submit" 
            class="btn" 
            :class="isActive ? 'btn-primary' : 'btn-danger'"
        >
            Register
        </button>
    </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();
const router = useRouter();

// ✅ added username
const username = ref('');
const email = ref('');
const password = ref('');

// ✅ include username in validation
const isActive = computed(() => {
    return username.value !== '' && email.value !== '' && password.value !== '';
});

async function register() {
    try {
        const response = await fetch('http://localhost:4000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.value, // ✅ added
                email: email.value,
                password: password.value
            })
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            notyf.error(data.message || 'Registration failed');
            return;
        }

        notyf.success('Registration successful! You can now log in.');

        // ✅ clear all fields
        username.value = '';
        email.value = '';
        password.value = '';

        router.push('/login');

    } catch (error) {
        console.error(error);
        notyf.error('Registration failed. Try again.');
    }
}
</script>