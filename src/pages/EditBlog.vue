<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();
const router = useRouter();
const route = useRoute();

const blogId = route.params.id; // get blog ID from route

// Blog fields
const title = ref('');
const content = ref('');
const author = ref('');
const information = ref('');

// Fetch the blog data on mount
onMounted(async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:4000/blogs/getBlog/${blogId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            title.value = data.title;
            content.value = data.content;
            author.value = data.author;
            information.value = data.information;
        } else {
            notyf.error(data.message || 'Failed to fetch blog');
        }
    } catch (err) {
        console.error(err);
        notyf.error('Error fetching blog');
    }
});

// Update blog
async function updateBlog() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:4000/blogs/updateBlog/${blogId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title.value,
                content: content.value,
                author: author.value,
                information: information.value
            })
        });

        const data = await response.json();
        if (!response.ok) {
            notyf.error(data.message || 'Failed to update blog');
            return;
        }

        notyf.success('Blog updated successfully!');
        router.push('/blogs'); // redirect back to blogs page
    } catch (err) {
        console.error(err);
        notyf.error('Error updating blog');
    }
}

// Go back button
function goBack() {
    router.push('/blogs');
}
</script>

<template>
  <div class="container mt-5" style="max-width: 600px;">
    <button @click="goBack" class="btn btn-secondary mb-4 mt-5">← Back to Blogs</button>

    <h1 class="text-center mb-4">Edit Blog</h1>

    <form @submit.prevent="updateBlog">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input type="text" class="form-control" v-model="title" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Content</label>
        <textarea class="form-control" rows="5" v-model="content" required></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Author</label>
        <input type="text" class="form-control" v-model="author" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Information</label>
        <textarea class="form-control" rows="3" v-model="information" required></textarea>
      </div>

      <button type="submit" class="btn btn-primary btn-lg w-100">Update Blog</button>
    </form>
  </div>
</template>

<style scoped>
.btn-lg { font-size: 1.2rem; padding: 0.75rem 1.5rem; border-radius: 10px; }
</style>