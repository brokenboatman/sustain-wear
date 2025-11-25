import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AccountView from "../views/AccountView.vue";
import RewardsView from "../views/RewardsView.vue";
import UnauthorisedView from "@/views/UnauthorisedView.vue";
import DashboardLayout from "@/components/DashboardLayout.vue";
import GoogleCallbackView from "../views/GoogleCallbackView.vue";
import MyDonationsView from "@/views/MyDonationsView.vue";
import UserManagementView from "@/views/UserManagementView.vue";
import DonationsView from "@/views/DonationsView.vue";
import ReportsView from "@/views/ReportsView.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
        meta: { requiresAuth: true },
      },
      {
        path: "my-donations",
        name: "my-donations",
        component: MyDonationsView,
        meta: { requiresAuth: true, requiredRoles: [1] },
      },
      {
        path: "account",
        name: "account",
        component: AccountView,
        meta: { requiresAuth: true, requiredRoles: [1, 2, 3] },
      },
      {
        path: "rewards",
        name: "rewards",
        component: RewardsView,
        meta: { requiresAuth: true, requiredRoles: [1] },
      },
      {
        path: "reports",
        name: "reports",
        component: ReportsView,
        meta: { requiresAuth: true, requiredRoles: [3] },
      },
      {
        path: "donations",
        name: "donations",
        component: DonationsView,
        meta: { requiresAuth: true, requiredRoles: [2] },
      },
      {
        path: "user-management",
        name: "user-management",
        component: UserManagementView,
        meta: { requiresAuth: true, requiredRoles: [3] },
      },
    ],
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
    path: "/Unauthorized",
    name: "unauthorized",
    component: UnauthorisedView,
  },
  {
    path: "/auth/google/callback",
    name: "google-callback",
    component: GoogleCallbackView,
  },
];

// const routes = [
//   {
//     path: "/",
//     name: "home",
//     component: HomeView,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/login",
//     name: "login",
//     component: LoginView,
//   },
//   {
//     path: "/register",
//     name: "register",
//     component: RegisterView,
//   },
//   {
//     path: "/account",
//     name: "account",
//     component: AccountView,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/rewards",
//     name: "rewards",
//     component: RewardsView,
//     meta: { requiresAuth: true },
//   },
//   {
//     path: "/Unauthorized",
//     name: "unauthorized",
//     component: UnauthorisedView,
//   },
//   {
//     path: "/auth/google/callback",
//     name: "google-callback",
//     component: () => import("../views/GoogleCallbackView.vue"),
//   },
// ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if(to.meta.requiredRoles) {
    const roleId = parseInt(localStorage.getItem("roleId"));
    if (!to.meta.requiredRoles.includes(roleId)) {
      next("/unauthorized");
      return;
    }
  }
  if (to.meta.requiresAuth && !token) {
    next("/unauthorized");
  } else {
    next();
  }
});

export default router;
