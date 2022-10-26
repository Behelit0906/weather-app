import { createRouter, createWebHistory, Router, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: RouteRecordRaw[] = [{
  path: "/",
  name: "home",
  component: HomeView,
}];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;