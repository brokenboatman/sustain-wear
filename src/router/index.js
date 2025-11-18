import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AccountView from "../views/AccountView.vue";
import RewardsView from "../views/RewardsView.vue";
import UnauthorisedView from "@/views/UnauthorisedView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/account",
    name: "account",
    component: AccountView,
    meta: { requiresAuth: true },
  },
  {
    path: "/rewards",
    name: "rewards",
    component: RewardsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/Unauthorized",
    name: "unauthorized",
    component: UnauthorisedView,
  },
  {
    path: "/auth/google/callback",
    name: "google-callback",
    component: () => import("../views/GoogleCallbackView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/unauthorized");
  } else {
    next();
  }
});

export default router;
