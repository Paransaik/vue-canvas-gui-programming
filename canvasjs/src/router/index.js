import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/canvas/:image',
    name: 'CanvasView',
    component: () => import('@/components/CanvasView.vue'),
    props: true,
  },
  {
    path: '/image',
    name: 'image',
    component: () => import('@/components/ImageListView.vue'),
    // children: [
    //   {
    //     path: 'canvas',
    //     name: 'canvas',
    //     component: () => import('@/components/CanvasView.vue')
    //   },
    // ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
