<script lang="ts" setup>
import { User } from '@/interfaces/User';
import { UserApi } from '@/services/api/users/users';
import Cookies from 'js-cookie';
import { onMounted, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userSession: Ref<User> = ref({});

const logOut = () => {
   Cookies.remove('Authorization');
   router.push('/');
}

const emit = defineEmits<{
   (event: 'havePermissions', payload: User): void;
}>();

onMounted(() => {
   const userService: UserApi = new UserApi();
   userService.getUserByEmail().then((res: any) => {
      userSession.value = res.data.data;
      emit('havePermissions', userSession.value);
   });
});
</script>

<template>
   <nav class="navbar navbar-expand-lg bg-body-tertiary pt-0">
      <div class="container-fluid">
         <router-link v-if="userSession.role?.pk_role === 1" to="/dashboard" class="navbar-brand">
            <img src="./../assets/logo.png" alt="Vue" width="60">
         </router-link>

         <a v-else href="#" class="navbar-brand">
            <img src="./../assets/logo.png" alt="Vue" width="60">
         </a>

         <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainMenu"
            aria-controls="mainMenu" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
         </button>
         <div class="collapse navbar-collapse" id="mainMenu">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
               <li class="nav-item">
                  <router-link to="/projects" class="nav-link">Proyectos</router-link>
               </li>

               <li v-if="userSession.role?.pk_role === 1" class="nav-item">
                  <router-link to="/tasks" class="nav-link">Tareas</router-link>
               </li>

               <li>
                  <router-link to="/my-tasks" class="nav-link">Mis Tareas</router-link>
               </li>

               <li v-if="userSession.role?.pk_role === 1" class="nav-item">
                  <router-link to="/users" class="nav-link">Usuarios</router-link>
               </li>
            </ul>

            <div class="d-flex">
               <p class="m-0 cursor-pointer" @click="logOut();"> Cerrar Sesión <i class="bi bi-x-circle-fill"></i></p>
            </div>
         </div>
      </div>
   </nav>
</template>