// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import Explore from '../sales/pages/Explore.vue';
import Wardrobe from "@/sales/pages/Wardrobe.vue";
import Favorites from "@/sales/pages/Favorites.vue";
import Start from "@/sales/pages/Start.vue";
import RegisterComponent from "@/iam/pages/register.component.vue";
import LoginComponent from "@/iam/pages/login.component.vue";
import { useProfileStore } from "@/users/services/profile.store.js";
import ProfileManagementComponent from "@/users/pages/profile-management.component.vue";
import ClotheDetailComponent from "@/sales/components/clothe-detail.component.vue";
import PageNotFoundComponent from "@/public/components/page-not-found.component.vue";
import SearchResults from "@/public/components/SearchResults.vue";

const routes = [
    { path: '/', component: LoginComponent, meta: { guest: true } },
    { path: '/login', name: 'login', component: LoginComponent, meta: { guest: true } },
    { path: '/register',  name: 'sign-up', component: RegisterComponent, meta: { guest: true } },
    { path: '/start', name:'home', component: Start, meta: { requiresAuth: true } },
    { path: '/explore', component: Explore, meta: { requiresAuth: true } },
    { path: '/wardrobe', component: Wardrobe, meta: { requiresAuth: true } },
    { path: '/favorites', component: Favorites, meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: ProfileManagementComponent },
    {path: '/product/:productId', name: 'ProductDetail', component:  () => import('@/users/pages/ProductDetail.vue'),
    },
    { path: '/categoria/:id', name: 'CategoryDetail', component: () => import('@/categories/components/CategoryDetail.vue'), meta: { requiresAuth: true } },
    {  path: '/clothing/:id', name: 'clothing-detail', component: ClotheDetailComponent,
        meta: { requiresAuth: true }
    },
    {
        path: '/search',
        name: 'search',
        component: SearchResults,
        meta: { requiresAuth: true }
    },

    {   path: '/:pathMatch(.*)*',       name: 'not-found',  component: PageNotFoundComponent,       meta: {title: 'Page not found'}},

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const profileStore = useProfileStore();

    // Si la ruta no existe (matched está vacío), dejar pasar para que caiga en PageNotFound
    if (to.matched.length === 0) {
        return next();
    }

    const authRequired = to.meta.requiresAuth;

    if (authRequired && !profileStore.isAuthenticated) {
        return next('/login');
    }

    next();
});


export default router;
