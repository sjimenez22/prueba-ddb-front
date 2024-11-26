import axios from 'axios';
import Cookies from 'js-cookie';

export function interceptorCookie() {
   axios.interceptors.request.use((config) => {
      const cookie: string | undefined = Cookies.get('Authorization');
      if (cookie) config.headers.set('Authorization', `Bearer ${cookie}`);

      return config;
   });
}

// export function setToken(name: string, value: string, options: Cookies.CookieAttributes) {
//    Cookies.set(name, value, options);
// }