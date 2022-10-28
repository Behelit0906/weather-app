import { createRouter, createWebHistory, Router, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CityViewVue from "../views/CityView.vue";

const routes: RouteRecordRaw[] = [{
  path: "/",
  name: "home",
  component: HomeView,
},
{
  path: "/weather/:country/:city",
  name: "cityView",
  component: CityViewVue,
}
];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;