<script lang="ts" setup>
import Header from '@/components/Header.vue';
import { Project } from '@/interfaces/Project';
import { Task } from '@/interfaces/Task';
import { User } from '@/interfaces/User';
import { ProjectApi } from '@/services/api/projects/projects';
import { TaskApi } from '@/services/api/tasks/tasks';
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const projects: Ref<Project[]> = ref([]);
const tasks: Ref<Task[]> = ref([]);
const userSession: Ref<User> = ref({});

const havePermissions = (data: User) => {
   if (data) {
      userSession.value = data;
      if (userSession.value.role?.pk_role !== 1) {
         router.push('/projects');
      }
   }
}

onMounted(() => {
   const projectService: ProjectApi = new ProjectApi();
   projectService.getProjects().then((res: any) => {
      projects.value = res.data.data;
   });

   const taskService: TaskApi = new TaskApi();
   taskService.getTasks().then((res: any) => {
      tasks.value = res.data.data;
   });
});
</script>

<template>
   <Header @have-permissions="havePermissions" />
   <div class="container">
      <div class="row">
         <div class="col-12 mb-4">
            <h1 class="display-4 fw-bold text-uppercase">Dashboard</h1>
         </div>

         <div class="col-12 col-md-4">
            <router-link to="/projects" class="text-decoration-none">
               <div class="bg-primary text-white text-center rounded">
                  <p class="fw-bold fs-4">Proyectos totales</p>
                  <p class="fs-4">{{ projects.length }}</p>
               </div>
            </router-link>
         </div>

         <div class="col-12 col-md-4">
            <router-link to="/tasks" class="text-decoration-none">
               <div class="bg-primary text-white text-center rounded">
                  <p class="fw-bold fs-4">Tareas totales</p>
                  <p class="fs-4">{{ tasks.length }}</p>
               </div>
            </router-link>
         </div>
      </div>
   </div>
</template>