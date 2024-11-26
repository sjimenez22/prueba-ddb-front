import Cookies from "js-cookie";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

const loginGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
   const cookie = Cookies.get('Authorization');
   if (cookie) {
      next('/dashboard');
   } else {
      next('');
   }
};
export default loginGuard;