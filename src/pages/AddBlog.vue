<template>
  <div class="container mt-5" style="max-width: 600px;">
    <!-- Back Button -->
    <button @click="goBack" class="btn btn-secondary mb-4 mt-5">
      ← Back to Blogs
    </button>

    <h1 class="my-4 text-center">Add Blog</h1>

    <form @submit.prevent="addBlog">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input
          type="text"
          class="form-control"
          placeholder="Enter blog title"
          v-model="title"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Content</label>
        <textarea
          class="form-control"
          rows="5"
          placeholder="Write blog content..."
          v-model="content"
          required
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Author</label>
        <input
          type="text"
          class="form-control"
          v-model="author"
          placeholder="Enter author name"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Information</label>
        <textarea
          class="form-control"
          rows="3"
          placeholder="Additional information..."
          v-model="information"
        ></textarea>
      </div>

      <button
        :disabled="!isActive"
        type="submit"
        class="btn btn-primary btn-lg w-100"
      >
        Add Blog
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useUserStore } from '@/stores/user';

const notyf = new Notyf();
const router = useRouter();
const userStore = useUserStore();

// Blog fields
const title = ref('');
const content = ref('');
const information = ref('');
const author = ref('');

// Set default author to logged-in username on mount
onMounted(() => {
  author.value = userStore.user?.username || '';
});

// Form validation
const isActive = computed(() => title.value && content.value && author.value);

// Add blog function
async function addBlog() {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:4000/blogs/addBlog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: title.value,
        content: content.value,
        author: author.value,       //
        information: information.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      notyf.error(data.message || 'Failed to add blog');
      return;
    }

    notyf.success('Blog added successfully');
    title.value = '';
    content.value = '';
    information.value = '';
    author.value = userStore.user?.username || '';

  } catch (error) {
    console.error(error);
    notyf.error('Something went wrong');
  }
}

// Back button
function goBack() {
  router.push('/blogs');
}
</script>

<style scoped>
.btn-lg {
  font-size: 1.2rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
}

.btn-secondary {
  font-size: 1rem;
  padding: 0.5rem 1rem;
}
</style>