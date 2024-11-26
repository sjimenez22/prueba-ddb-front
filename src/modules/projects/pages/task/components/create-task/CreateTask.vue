<script lang="ts" setup>
import Toast from '@/components/Toast.vue';
import { StatusTask } from '@/interfaces/StatusTask';
import { Task } from '@/interfaces/Task';
import { User } from '@/interfaces/User';
import { TaskApi } from '@/services/api/tasks/tasks';
import { reactive, ref, Ref } from 'vue';

let task: Task = reactive<Task>({});
const taskService: TaskApi = new TaskApi();

let errorMsg: Ref<string> = ref('');

let messageToast: Ref<string> = ref('');
let viewToast: Ref<boolean> = ref(false);

const emit = defineEmits<{
   (event: 'reloadData', payload: boolean): void;
}>();

const props = defineProps<{
   user: User,
   idProject: string | string[],
   statusTasks: StatusTask[],
   users: User[]
}>();

const insert = () => {
   task.fk_user_creator = props.user.pk_user;
   task.fk_project = +props.idProject;
   taskService.insertTask(task).then((res: any) => {
      if (res.data) {
         let btnCloseModal = document.getElementById('btnCloseModal');
         btnCloseModal?.click();

         emit('reloadData', true);

         messageToast.value = `Se creó la tarea ${res.data.data.c_name}`;
         viewToast.value = true;
         task = reactive<Task>({});
      } else {
         errorMsg.value = res.response.data.message;
      }
   });
}

const openModal = () => {
   viewToast.value = false;
}
</script>

<template>
   <!-- Button trigger modal -->
   <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createTask"
      @click="openModal();">
      Crear Tarea
   </button>

   <!-- Modal -->
   <div class="modal fade" id="createTask" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
      aria-labelledby="createTaskLabel" aria-hidden="true">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h1 class="modal-title fs-4" id="createTaskLabel">Crear una tarea</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <form @submit.prevent="insert()">
                  <div class="mb-3 text-start">
                     <label for="nameCreate" class="form-label">Nombre</label>
                     <input type="text" class="form-control" id="nameCreate" v-model="task.c_name" required>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="descriptionCreate" class="form-label">Descripción</label>
                     <textarea class="form-control" id="descriptionCreate" rows="3" v-model="task.c_description"
                        required></textarea>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="dateEndCreate" class="form-label">Fecha de finalización</label>
                     <input type="date" class="form-control" id="dateEndCreate" v-model="task.d_completion" required>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="statusCreate" class="form-label">Seleccione un estado para la tarea</label>
                     <select class="form-select" id="statusCreate" aria-label="Seleccione un estado para la tarea"
                        v-model="task.fk_status">
                        <option v-for="status of statusTasks" :value="status.pk_status">{{ status.c_name }}</option>
                     </select>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="userResponsibleCreate" class="form-label">Seleccione el usuario responsable</label>
                     <select class="form-select" id="userResponsibleCreate"
                        aria-label="Seleccione el usuario responsable" v-model="task.fk_user_responsible">
                        <option v-for="userResponsible of users" :value="userResponsible.pk_user">
                           {{ userResponsible.c_email }}
                        </option>
                     </select>
                  </div>

                  <p v-if="errorMsg" class="text-danger">{{ errorMsg }}</p>

                  <div class="mb-3 text-center">
                     <button type="submit" id="btnOpenModal" class="btn btn-primary px-5 me-3">Crear</button>
                     <button type="button" id="btnCloseModal" class="btn btn-secondary px-5"
                        data-bs-dismiss="modal">Cerrar</button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   </div>

   <Toast v-if="viewToast" title="Guardado" :message="messageToast" :view-toast="viewToast" />
</template>