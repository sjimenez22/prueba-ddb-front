import '@/assets/global/styles.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createApp } from 'vue';
import App from './App.vue';
import { interceptorCookie } from './interceptors/cookieInterceptor';
import router from './routes/routes';

const app = createApp(App);
app.use(router).mount('#app');

interceptorCookie();