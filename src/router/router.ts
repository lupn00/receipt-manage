import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";
import routes from "./routes";

// import store from "@/store";
// import ApiService from "@/core/services/ApiService";
// import JwtService from "@/core/services/JwtService";

import { NoNeedRightPaths } from "./noNeedRightPaths";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // current page view title
  console.log("12313", to.meta.pageTitle);
  let title = "";
  if (to.meta.pageTitle) {
    title = to.meta.pageTitle + "-";
  }
  document.title = `${title}${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  // authStore.verifyAuth();

  const result = NoNeedRightPaths.find(
    (currentValue) => currentValue === to.name
  );
  if (result) {
    //此条件下不需要验证直接放行
    next();
  } else {
    if (authStore.isAuthenticated) {
      next();
    } else {
      next({ name: "sign-in" });
    }
  }

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

export default router;
