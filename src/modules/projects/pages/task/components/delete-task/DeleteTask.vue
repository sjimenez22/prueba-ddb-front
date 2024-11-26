<script lang="ts" setup>
import Toast from '@/components/Toast.vue';
import { User } from '@/interfaces/User';
import { TaskApi } from '@/services/api/tasks/tasks';
import { ref, Ref } from 'vue';

const taskService: TaskApi = new TaskApi();

let errorMsg: Ref<string> = ref('');

let messageToast: Ref<string> = ref('');
let viewToast: Ref<boolean> = ref(false);

const props = defineProps<{
   idTask: number | undefined,
   user: User
}>();

const emit = defineEmits<{
   (event: 'reloadData', payload: boolean): void;
}>();

const deleteTask = () => {
   taskService.deleteProject(props.idTask).then((res: any) => {
      if (res.data) {
         let btnCloseModal = document.getElementById(`btnCloseDeleteTask${props.idTask}Modal`);
         btnCloseModal?.click();

         emit('reloadData', true);

         messageToast.value = `Se eliminó la tarea ${res.data.data.c_name}`;
         viewToast.value = true;
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
   <i class="bi bi-trash-fill cursor-pointer" data-bs-toggle="modal" :data-bs-target="`#deleteTask${props.idTask}`"
      @click="openModal();"></i>

   <!-- Modal -->
   <div class="modal fade" :id="`deleteTask${props.idTask}`" data-bs-backdrop="static" data-bs-keyboard="false"
      tabindex="-1" :aria-labelledby="`deleteTask${props.idTask}Label`" aria-hidden="true">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h1 class="modal-title fs-4" :id="`deleteTask${props.idTask}Label`">Eliminar tarea</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <p class="fs-3">¿Esta seguro de eliminar la tarea?</p>

               <p v-if="errorMsg" class="text-danger">{{ errorMsg }}</p>

               <div class="mb-3 text-center">
                  <button type="button" class="btn btn-danger px-5 me-3" @click="deleteTask()">Eliminar</button>
                  <button type="button" :id="`btnCloseDeleteTask${props.idTask}Modal`" class="btn btn-secondary px-5"
                     data-bs-dismiss="modal">Cerrar</button>
               </div>
            </div>
         </div>
      </div>
   </div>

   <Toast v-if="viewToast" title="Eliminado" :message="messageToast" :view-toast="viewToast" />
</template>