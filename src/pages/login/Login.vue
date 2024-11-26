<script lang="ts" setup>
import { User } from '@/interfaces/User';
import { AuthApi } from '@/services/api/auth/auth';
import { reactive, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';

const route = useRouter();

let isShowPassword: Ref<boolean> = ref(false);
let errorMsg: Ref<string> = ref('');

const user: User = reactive<User>({});

const login = async () => {
   const authService: AuthApi = new AuthApi();
   authService.login(user).then((res: any) => {
      if (res.data) {
         let date: Date = new Date();
         date.setDate(date.getDate() + 7);
         document.cookie = `Authorization=${res.data.authorization.token}; expires=${date.toString()}`;
         errorMsg.value = '';
         route.push('/dashboard');
      } else {
         errorMsg.value = res.response.data.message;
      }
   });
}

const showPassword = (): void => {
   isShowPassword.value = !isShowPassword.value;
}
</script>

<template>
   <div class="container mt-5">
      <div class="row">
         <div class="col-12 mb-4">
            <h1 class="display-4 fw-bold text-uppercase">Inicia sesión</h1>
         </div>

         <div class="col-12 col-md-6 offset-md-3">
            <form @submit.prevent="login()">
               <div class="mb-3 text-start">
                  <label for="email" class="form-label">Correo electrónico</label>
                  <input type="email" class="form-control" id="email" v-model="user.c_email" required>
               </div>

               <div class="mb-3 text-start">
                  <label for="password" class="form-label">Contraseña</label>
                  <div class="input-group">
                     <input :type="(isShowPassword ? 'text' : 'password')" class="form-control" id="password"
                        v-model="user.c_password" required>
                     <span class="input-group-text cursor-pointer" @click="showPassword()">
                        <i v-if="!isShowPassword" class="bi bi-eye"></i>
                        <i v-else class="bi bi-eye-slash"></i>
                     </span>
                  </div>
               </div>

               <p v-if="errorMsg" class="text-danger">{{ errorMsg }}</p>

               <div class="mb-3 text-center">
                  <button type="submit" class="btn btn-primary px-5 fs-5">Enviar</button>
               </div>
            </form>
         </div>
      </div>
   </div>
</template>