// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ChatView from '../views/ChatView.vue'
import ProcessedDocumentsView from '../views/ProcessedDocumentsView.vue' 
// Import your store if needed for route guards
// import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true } // Example meta field for auth logic
  },
  {
    path: '/', // Default route, maybe redirect or make it the chat view
    name: 'Chat',
    component: ChatView,
    meta: { requiresAuth: true } // Example meta field for auth logic
  },
  { 
    path: '/knowledge-base', // Route for knowledge base management
    name: 'KnowledgeBase',
    component: ProcessedDocumentsView,
    meta: { requiresAuth: true } // Assuming users must be logged in
  },
  // Add other routes like chat history, settings etc.
  // {
  //   path: '/:pathMatch(.*)*', // Catch-all 404
  //   name: 'NotFound',
  //   component: () => import('../views/NotFoundView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use browser history mode
  routes
})

// --- Navigation Guard (Example for Authentication) ---
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore(); // Initialize OUTSIDE the guard if possible or ensure Pinia is active
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//   const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

//   if (requiresAuth && !authStore.isAuthenticated) {
//     next('/login'); // Redirect to login if auth is required but user is not logged in
//   } else if (requiresGuest && authStore.isAuthenticated) {
//     next('/'); // Redirect to home/chat if guest page is accessed while logged in
//   } else {
//     next(); // Proceed as normal
//   }
// });
// --- End Navigation Guard ---


export default router