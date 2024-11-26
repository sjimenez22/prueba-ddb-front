import Cookies from "js-cookie";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

const authGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
   const cookie = Cookies.get('Authorization');
   if (cookie) {
      next();
   } else {
      next('/login');
   }
};
export default authGuard;