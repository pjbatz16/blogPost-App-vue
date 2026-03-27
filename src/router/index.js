import {createRouter, createWebHistory} from "vue-router"

import Login from "../pages/Login.vue"
import Register from "../pages/Register.vue"
import Blogs from "../pages/Blogs.vue"
import AddBlog from "../pages/AddBlog.vue"
import EditBlog from "../pages/EditBlog.vue"
// import AdminDashboard from "../pages/AdminDashboard.vue"
// import ViewMovie from "../pages/ViewMovie.vue"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path : "/login",
			name: "login",
			component: Login
		},
		{
			path : "/register",
			name: "register",
			component: Register
		},
		{
			path : "/blogs",
			name: "blogs",
			component: Blogs
		},
		{
			path : "/addBlog",
			name: "addBlog",
			component: AddBlog
		},
		{
		    path: '/editBlog/:id',
		    name: 'EditBlog',
		    component: EditBlog
		}
		// {
		// 	path : "/adminDashboard",
		// 	name: "adminDashboard",
		// 	component: AdminDashboard
		// },
		// {
		//   path: '/movies/:id',
		//   name: "viewMovie",
		//   component: ViewMovie
		// }
	]
})

export default router