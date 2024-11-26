<script lang="ts" setup>
import Header from '@/components/Header.vue';
import { Role } from '@/interfaces/Role';
import { User } from '@/interfaces/User';
import { RolesApi } from '@/services/api/roles/roles';
import { UserApi } from '@/services/api/users/users';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import CreateUser from './components/create-user/CreateUser.vue';
import DeleteUser from './components/delete-user/DeleteUser.vue';
import EditUser from './components/edit-user/EditUser.vue';

const router = useRouter();

const roles: Ref<Role[]> = ref([]);
const users: Ref<User[]> = ref([]);
const userService: UserApi = new UserApi();
const userSession: Ref<User> = ref({});

const formatDate = (isoDate: string): string => {
   return format(new Date(isoDate), "dd 'de' MMMM 'de' yyyy HH:mm:ss", { locale: es });
};

const reloadData = (data: boolean) => {
   if (data) {
      userService.getUsers().then((res: any) => {
         users.value = res.data.data;
      });
   }
};

const havePermissions = (data: User) => {
   if (data) {
      userSession.value = data;
      if (userSession.value.role?.pk_role !== 1) {
         router.push('/projects');
      }
   }
}

onMounted(() => {
   userService.getUsers().then((res: any) => {
      users.value = res.data.data;
   });

   const rolesService: RolesApi = new RolesApi();
   rolesService.getRoles().then((res: any) => {
      roles.value = res.data.data;
   });
});
</script>

<template>
   <Header @have-permissions="havePermissions" />
   <div class="container">
      <div class="row">
         <div class="col-12 mb-4">
            <h1 class="display-4 fw-bold text-uppercase">Usuarios</h1>
         </div>

         <div class="col-12">
            <div class="text-end mb-4">
               <CreateUser :roles="roles" @reload-data="reloadData" />
            </div>

            <div class="table-responsive">
               <table class="table">
                  <thead>
                     <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Correo</th>
                        <th scope="col">Rol</th>
                        <th scope="col">Fecha de creación</th>
                        <th scope="col">Ver tareas</th>
                        <th scope="col">Editar</th>
                        <th scope="col">Eliminar</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="user of users" :key="user.pk_user">
                        <td>{{ user.c_name }}</td>
                        <td>{{ user.c_email }}</td>
                        <td>{{ user.role?.c_name }}</td>
                        <td>{{ formatDate(user.created_at ?? '') }}</td>
                        <td>
                           <router-link :to="`/tasks?user=${user.pk_user}`">
                              <i class="bi bi-eye-fill" style="color: #000"></i>
                           </router-link>
                        </td>
                        <td>
                           <EditUser :id-user="user.pk_user" :roles="roles" @reload-data="reloadData" />
                        </td>
                        <td>
                           <DeleteUser :id-user="user.pk_user" @reload-data="reloadData" />
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   </div>
</template>