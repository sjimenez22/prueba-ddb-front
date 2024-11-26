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
   idTask: number | undefined,
   user: User,
   idProject: string | string[],
   statusTasks: StatusTask[],
   users: User[]
}>();

const update = () => {
   task.fk_user_creator = props.user.pk_user;
   task.fk_project = +props.idProject;
   taskService.updateTask(task).then((res: any) => {
      if (res.data) {
         let btnCloseModal = document.getElementById(`btnCloseEdit${props.idTask}Modal`);
         btnCloseModal?.click();

         emit('reloadData', true);

         messageToast.value = `Se actualizó la tarea ${res.data.data.c_name}`;
         viewToast.value = true;
         task = reactive<Task>({});
      } else {
         errorMsg.value = res.response.data.message;
      }
   });
}

const openModal = () => {
   viewToast.value = false;

   taskService.getTask(props.idTask).then((res: any) => {
      if (res.data) {
         task.pk_task = res.data.data.pk_task;
         task.c_name = res.data.data.c_name;
         task.c_description = res.data.data.c_description;
         task.d_completion = res.data.data.d_completion;
         task.fk_status = res.data.data.status_task.pk_status;
         task.fk_user_responsible = res.data.data.user_responsible.pk_user;
      } else {
         errorMsg.value = res.response.data.message;
      }
   });
}
</script>

<template>
   <i class="bi bi-pencil-square cursor-pointer" style="color: #000" data-bs-toggle="modal"
      :data-bs-target="`#updateTask${props.idTask}`" @click="openModal();"></i>

   <!-- Modal -->
   <div class="modal fade" :id="`updateTask${props.idTask}`" data-bs-backdrop="static" data-bs-keyboard="false"
      tabindex="-1" :aria-labelledby="`updateTask${props.idTask}Label`" aria-hidden="true">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h1 class="modal-title fs-4" :id="`updateTask${props.idTask}Label`">Actualizar tarea</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <form @submit.prevent="update()">
                  <div class="mb-3 text-start">
                     <label for="nameUpdate" class="form-label">Nombre</label>
                     <input type="text" class="form-control" id="nameUpdate" v-model="task.c_name" required>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="descriptionUpdate" class="form-label">Descripción</label>
                     <textarea class="form-control" id="descriptionUpdate" rows="3" v-model="task.c_description"
                        required></textarea>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="dateEndUpdate" class="form-label">Fecha de finalización</label>
                     <input type="date" class="form-control" id="dateEndUpdate" v-model="task.d_completion" required>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="statusUpdate" class="form-label">Seleccione un estado para la tarea</label>
                     <select class="form-select" id="statusUpdate" aria-label="Seleccione un estado para la tarea"
                        v-model="task.fk_status">
                        <option v-for="status of statusTasks" :value="status.pk_status">{{ status.c_name }}</option>
                     </select>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="userResponsibleUpdate" class="form-label">Seleccione el usuario responsable</label>
                     <select class="form-select" id="userResponsibleUpdate"
                        aria-label="Seleccione el usuario responsable" v-model="task.fk_user_responsible">
                        <option v-for="userResponsible of users" :value="userResponsible.pk_user"
                           :selected="userResponsible.pk_user === task.fk_user_responsible">
                           {{ userResponsible.c_email }}
                        </option>
                     </select>
                  </div>

                  <p v-if="errorMsg" class="text-danger">{{ errorMsg }}</p>

                  <div class="mb-3 text-center">
                     <button type="submit" class="btn btn-primary px-5 me-3">Actualizar</button>
                     <button type="button" :id="`btnCloseEdit${props.idTask}Modal`" class="btn btn-secondary px-5"
                        data-bs-dismiss="modal">Cerrar</button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   </div>

   <Toast v-if="viewToast" title="Actualizado" :message="messageToast" :view-toast="viewToast" />
</template>