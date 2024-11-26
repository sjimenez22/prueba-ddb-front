<script lang="ts" setup>
import Header from '@/components/Header.vue';
import { StatusTask } from '@/interfaces/StatusTask';
import { Task } from '@/interfaces/Task';
import { User } from '@/interfaces/User';
import { StatusTaskApi } from '@/services/api/status-tasks/statusTasks';
import { TaskApi } from '@/services/api/tasks/tasks';
import { UserApi } from '@/services/api/users/users';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { onMounted, Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CreateTask from './components/create-task/CreateTask.vue';
import DeleteTask from './components/delete-task/DeleteTask.vue';
import EditTask from './components/edit-task/EditTask.vue';

const route = useRoute();
const router = useRouter();

const userSession: Ref<User> = ref({});
let tasks: Ref<Task[]> = ref([]);
const users: Ref<User[]> = ref([]);
const statusTasks: Ref<StatusTask[]> = ref([]);
const taskService: TaskApi = new TaskApi();

const formatDate = (isoDate: string): string => {
   return format(new Date(isoDate), "dd 'de' MMMM 'de' yyyy HH:mm:ss", { locale: es });
};

const reloadData = (data: boolean) => {
   if (data) {
      taskService.getTasksByProject(+route.params.idProject).then((res: any) => {
         if (res.data) {
            tasks.value = res.data.data;
         }
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
   taskService.getTasksByProject(+route.params.idProject).then((res: any) => {
      if (res.data) {
         tasks.value = res.data.data;
      }
   });

   const userService: UserApi = new UserApi();
   userService.getUsers().then((res: any) => {
      users.value = res.data.data;
   });

   const statusTasksService: StatusTaskApi = new StatusTaskApi();
   statusTasksService.getStatusTasks().then((resStatus: any) => {
      statusTasks.value = resStatus.data.data;
   });
});
</script>

<template>
   <Header @have-permissions="havePermissions" />
   <div class="container">
      <div class="row">
         <div class="col-12 mb-4">
            <h1 class="display-4 fw-bold text-uppercase">Tareas del proyecto #{{ route.params.idProject }}</h1>
         </div>

         <div class="col-12">
            <div class="text-end mb-4">
               <CreateTask :status-tasks="statusTasks" :users="users" :user="userSession"
                  :id-project="route.params.idProject" @reload-data="reloadData" />
            </div>

            <div class="table-responsive">
               <table class="table">
                  <thead>
                     <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Fecha de vencimiento</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Usuario responsable</th>
                        <th scope="col">Usuario creador</th>
                        <th scope="col">Fecha de creación</th>
                        <th scope="col">Editar</th>
                        <th scope="col">Eliminar</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr v-for="task of tasks" :key="task.pk_task">
                        <td>{{ task.c_name }}</td>
                        <td>{{ task.c_description }}</td>
                        <td>{{ formatDate(task.d_completion ?? '') }}</td>
                        <td>{{ task.status_task?.c_name }}</td>
                        <td>{{ task.user_responsible?.c_name }} <br> <small>{{ task.user_responsible?.c_email }}</small>
                        </td>
                        <td>{{ task.user_creator?.c_name }} <br> <small>{{ task.user_creator?.c_email }}</small></td>
                        <td>{{ formatDate(task.created_at ?? '') }}</td>
                        <td>
                           <EditTask :id-task="task.pk_task" :status-tasks="statusTasks" :users="users"
                              :user="userSession" :id-project="route.params.idProject" @reload-data="reloadData" />
                        </td>
                        <td>
                           <DeleteTask :user="userSession" :id-task="task.pk_task" @reload-data="reloadData" />
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   </div>
</template>