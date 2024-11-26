<script lang="ts" setup>
import Header from '@/components/Header.vue';
import { Project } from '@/interfaces/Project';
import { User } from '@/interfaces/User';
import { ProjectApi } from '@/services/api/projects/projects';
import { AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { onMounted, Ref, ref } from 'vue';
import CreateProject from './components/create-project/CreateProject.vue';
import DeleteProject from './components/delete-project/DeleteProject.vue';
import EditProject from './components/edit-project/EditProject.vue';

let projects: Ref<Project[]> = ref([]);
const projectService: ProjectApi = new ProjectApi();
const userSession: Ref<User> = ref({});

const formatDate = (isoDate: string): string => {
   return format(new Date(isoDate), "dd 'de' MMMM 'de' yyyy HH:mm:ss", { locale: es });
};

const reloadData = (data: boolean) => {
   if (data) {
      projectService.getProjects().then((res: AxiosResponse) => {
         projects.value = res.data.data;
      });
   }
}

const havePermissions = (data: User) => {
   if (data) {
      userSession.value = data;
   }
}

onMounted(() => {
   projectService.getProjects().then((res: AxiosResponse) => {
      projects.value = res.data.data;
   });
});
</script>

<template>
   <Header @have-permissions="havePermissions" />
   <div class="container">
      <div class="row">
         <div class="col-12 mb-4">
            <h1 class="display-4 fw-bold text-uppercase">Proyectos</h1>
         </div>

         <div class="col-12">
            <div class="text-end mb-4" v-if="userSession.role?.pk_role === 1">
               <CreateProject :user="userSession" @reload-data="reloadData" />
            </div>

            <div class="table-responsive">
               <table class="table">
                  <thead>
                     <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Usuario creador</th>
                        <th scope="col">Fecha de creación</th>
                        <th scope="col" v-if="userSession.role?.pk_role === 1">Ver tareas</th>
                        <th scope="col" v-if="userSession.role?.pk_role === 1">Editar</th>
                        <th scope="col" v-if="userSession.role?.pk_role === 1">Eliminar</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="project of projects" :key="project.pk_project">
                        <th scope="row">{{ project.pk_project }}</th>
                        <td>{{ project.c_name }}</td>
                        <td>{{ project.user?.c_name }} <br> <small>{{ project.user?.c_email }}</small></td>
                        <td>{{ formatDate(project.created_at ?? '') }}</td>
                        <td v-if="userSession.role?.pk_role === 1">
                           <router-link :to="`/project/${project.pk_project}/tasks`">
                              <i class="bi bi-eye-fill" style="color: #000"></i>
                           </router-link>
                        </td>
                        <td v-if="userSession.role?.pk_role === 1">
                           <EditProject :user="userSession" :id-project="project.pk_project"
                              @reload-data="reloadData" />
                        </td>
                        <td v-if="userSession.role?.pk_role === 1">
                           <DeleteProject :user="userSession" :id-project="project.pk_project"
                              @reload-data="reloadData" />
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   </div>
</template>