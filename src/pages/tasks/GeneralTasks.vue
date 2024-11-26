<script lang="ts" setup>
import Header from '@/components/Header.vue';
import { Project } from '@/interfaces/Project';
import { StatusTask } from '@/interfaces/StatusTask';
import { Task } from '@/interfaces/Task';
import { User } from '@/interfaces/User';
import { ProjectApi } from '@/services/api/projects/projects';
import { StatusTaskApi } from '@/services/api/status-tasks/statusTasks';
import { TaskApi } from '@/services/api/tasks/tasks';
import { UserApi } from '@/services/api/users/users';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { onMounted, Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CreateGeneralTask from './components/create-general-task/CreateGeneralTask.vue';
import DeleteGeneralTask from './components/delete-general-task/DeleteGeneralTask.vue';
import EditGeneralTask from './components/edit-general-task/EditGeneralTask.vue';

const route = useRoute();
const router = useRouter();

let tasks: Ref<Task[]> = ref([]);
const projects: Ref<Project[]> = ref([]);
const users: Ref<User[]> = ref([]);
const statusTasks: Ref<StatusTask[]> = ref([]);
const taskService: TaskApi = new TaskApi();
const userSession: Ref<User> = ref({});

const formatDate = (isoDate: string): string => {
   return format(new Date(isoDate), "dd 'de' MMMM 'de' yyyy HH:mm:ss", { locale: es });
};

const reloadData = (data: boolean) => {
   if (data) {
      taskService.getTasks().then((res: any) => {
         if (res.data) {
            tasks.value = res.data.data;
         }
      });
   }
}

const havePermissions = (data: User) => {
   if (data) {
      userSession.value = data;
   }
}

onMounted(() => {
   setTimeout(() => {
      if (userSession.value.role?.pk_role !== 1) {
         if (route.name === 'my-tasks') {
            taskService.getTasksByUser(userSession.value.pk_user).then((res: any) => {
               if (res.data) {
                  tasks.value = res.data.data;
               }
            });
         } else {
            router.push('/projects');
         }
      } else {
         if (route.query && route.query.user) {
            taskService.getTasksByUser(+route.query.user).then((res: any) => {
               if (res.data) {
                  tasks.value = res.data.data;
               }
            });
         } else {
            taskService.getTasks().then((res: any) => {
               if (res.data) {
                  tasks.value = res.data.data;
               }
            });
         }
      }
   }, 1500);

   const userService: UserApi = new UserApi();
   userService.getUsers().then((res: any) => {
      users.value = res.data.data;
   });

   const statusTasksService: StatusTaskApi = new StatusTaskApi();
   statusTasksService.getStatusTasks().then((resStatus: any) => {
      statusTasks.value = resStatus.data.data;
   });

   const projectService: ProjectApi = new ProjectApi();
   projectService.getProjects().then((res: any) => {
      projects.value = res.data.data;
   });
});
</script>

<template>
   <Header @have-permissions="havePermissions" />
   <div class="container">
      <div class="row">
         <div class="col-12 mb-4">
            <h1 class="display-4 fw-bold text-uppercase">Tareas</h1>
         </div>

         <div class="col-12">
            <div class="text-end mb-4" v-if="userSession.role?.pk_role === 1">
               <CreateGeneralTask :status-tasks="statusTasks" :users="users" :user="userSession" :projects="projects"
                  @reload-data="reloadData" />
            </div>

            <div class="table-responsive">
               <table class="table">
                  <thead>
                     <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Fecha de vencimiento</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Proyecto</th>
                        <th scope="col">Usuario responsable</th>
                        <th scope="col">Usuario creador</th>
                        <th scope="col">Fecha de creación</th>
                        <th scope="col">Editar</th>
                        <th scope="col" v-if="userSession.role?.pk_role === 1">Eliminar</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="task of tasks" :key="task.pk_task">
                        <td>{{ task.c_name }}</td>
                        <td>{{ task.c_description }}</td>
                        <td>{{ formatDate(task.d_completion ?? '') }}</td>
                        <td>{{ task.status_task?.c_name }}</td>
                        <td>{{ task.project?.c_name }}</td>
                        <td>{{ task.user_responsible?.c_name }} <br> <small>{{ task.user_responsible?.c_email }}</small>
                        </td>
                        <td>{{ task.user_creator?.c_name }} <br> <small>{{ task.user_creator?.c_email }}</small></td>
                        <td>{{ formatDate(task.created_at ?? '') }}</td>
                        <td>
                           <EditGeneralTask :id-task="task.pk_task" :status-tasks="statusTasks" :users="users"
                              :user="userSession" :projects="projects" @reload-data="reloadData" />
                        </td>
                        <td v-if="userSession.role?.pk_role === 1">
                           <DeleteGeneralTask :user="userSession" :id-task="task.pk_task" @reload-data="reloadData" />
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   </div>
</template>