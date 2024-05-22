import {
  createWebHistory,
  createRouter,
  RouteLocationNormalized,
  NavigationGuardNext
} from "vue-router";
import { useUser } from "@/entities/user";

const { setUser } = useUser();

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "login" */ "./login")
  },
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "./home"),
    meta: {
      auth: true
    }
  },
  {
    path: "/test/:testId",
    name: "test",
    component: () => import(/* webpackChunkName: "home" */ "./test"),
    meta: {
      auth: true
    }
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

const authMiddleware = (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (to.meta.auth && !localStorage.getItem("access_token")) {
    next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
};

const getUserMiddleware = async (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  console.log(to.meta.auth);
  await setUser();
  next();
};

[authMiddleware, getUserMiddleware].forEach(guard => router.beforeEach(guard));
