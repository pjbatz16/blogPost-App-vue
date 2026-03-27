<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useUserStore } from '@/stores/user';

const notyf = new Notyf();
const router = useRouter();
const userStore = useUserStore();

// Reactive list of blogs
const blogs = ref([]);

// Computed property to check if current user is admin
const isAdmin = computed(() => userStore.user?.isAdmin);

// Fetch all blogs from backend
async function fetchBlogs() {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:4000/blogs/getBlogs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            notyf.error(data.message || 'Failed to fetch blogs');
            return;
        }

        blogs.value = data.blogs || data;
    } catch (error) {
        console.error(error);
        notyf.error('Something went wrong fetching blogs');
    }
}

// Redirect to AddBlog page
function goToAddBlog() {
    router.push('/addBlog');
}

// Edit blog (only visible for non-admin)
function editBlog(id) {
    router.push(`/editBlog/${id}`);
}

// Delete blog (visible for all users)
async function deleteBlog(blog) {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    const token = localStorage.getItem('token');
    if (!token) return notyf.error("You are not logged in");

    // Only creator or admin
    if (!userStore.user.isAdmin && (!blog.authorId || blog.authorId.toString() !== userStore.user.id)) {
        return notyf.error("You cannot delete this blog");
    }

    try {
        const response = await fetch(`http://localhost:4000/blogs/deleteBlog/${blog._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            return notyf.error(data.message || 'Failed to delete blog');
        }

        notyf.success('Blog deleted successfully');
        blogs.value = blogs.value.filter(b => b._id !== blog._id);

    } catch (error) {
        console.error(error);
        notyf.error('Something went wrong');
    }
}

onMounted(() => {
    fetchBlogs();
});
</script>

<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4 mt-5">
      <h1 class="display-3">All Blogs</h1>
      <button @click="goToAddBlog" class="btn btn-success btn-lg">
        + Add Blog
      </button>
    </div>

    <div v-if="blogs.length === 0" class="text-center fs-4 text-muted">
      No blogs available.
    </div>

    <div v-else class="blog-list">
      <article
        v-for="blog in blogs"
        :key="blog._id"
        class="blog-post shadow-sm mb-5 p-5"
      >
        <!-- Title -->
        <h2 class="post-title mb-3">Title: {{ blog.title }}</h2>

        <!-- Author + Info -->
        <p class="mb-1"><strong>Author:</strong> {{ blog.author }}</p>
        <p class="mb-0"><strong>Info:</strong> {{ blog.information }}</p>

        <!-- Content -->
        <div class="post-content mb-4">
          <p v-for="line in blog.content.split('\n')" :key="line">{{ line }}</p>
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-content-end">
          <!-- Edit: only non-admin -->
          <button
            v-if="!isAdmin"
            @click="editBlog(blog._id)"
            class="btn btn-warning me-2"
          >
            Edit
          </button>

          <!-- Delete: visible to all -->
          <button @click="deleteBlog(blog)" class="btn btn-danger">Delete</button>
        </div>

        <hr class="mt-4">
      </article>
    </div>
  </div>
</template>

<style scoped>
.blog-post {
    background-color: #ffffff;
    border-radius: 15px;
    padding: 40px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.blog-post:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}

.post-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #222;
    line-height: 1.2;
}

.post-content {
    font-size: 1.15rem;
    line-height: 1.8;
    color: #333;
}

.container {
    max-width: 900px;
}

.btn-lg {
    font-size: 1.2rem;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
}

hr {
    border-top: 1px solid #ddd;
}
</style>