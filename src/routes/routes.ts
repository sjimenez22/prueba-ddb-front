import authGuard from '@/guards/authGuard';
import loginGuard from '@/guards/loginGuard';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
   {
      path: '/', component: () => import('@/pages/login/Login.vue'), name: 'home'
   },
   {
      path: '/login', component: () => import('@/pages/login/Login.vue'), name: 'login', beforeEnter: loginGuard
   },
   {
      path: '/dashboard', component: () => import('@/pages/dashboard/Dashboard.vue'), name: 'dashboard', beforeEnter: authGuard
   },
   {
      path: '/projects', component: () => import('@/modules/projects/pages/project/Project.vue'), name: 'projects', beforeEnter: authGuard
   },
   {
      path: '/project/:idProject/tasks', component: () => import('@/modules/projects/pages/task/Task.vue'), name: 'tasks', beforeEnter: authGuard
   },
   {
      path: '/tasks', component: () => import('@/pages/tasks/GeneralTasks.vue'), name: 'all-tasks', beforeEnter: authGuard
   },
   {
      path: '/users', component: () => import('@/pages/users/Users.vue'), name: 'users', beforeEnter: authGuard
   },
   {
      path: '/my-tasks', component: () => import('@/pages/tasks/GeneralTasks.vue'), name: 'my-tasks', beforeEnter: authGuard
   },
];

const router = createRouter({
   history: createWebHistory(),
   routes,
});

export default router;
