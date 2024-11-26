<script lang="ts" setup>
import Toast from '@/components/Toast.vue';
import { UserApi } from '@/services/api/users/users';
import { ref, Ref } from 'vue';

const userService: UserApi = new UserApi();

let errorMsg: Ref<string> = ref('');

let messageToast: Ref<string> = ref('');
let viewToast: Ref<boolean> = ref(false);

const props = defineProps<{
   idUser: number | undefined
}>();

const emit = defineEmits<{
   (event: 'reloadData', payload: boolean): void;
}>();

const deleteUser = () => {
   userService.deleteUser(props.idUser).then((res: any) => {
      if (res.data) {
         let btnCloseModal = document.getElementById(`btnCloseDeleteUser${props.idUser}Modal`);
         btnCloseModal?.click();

         emit('reloadData', true);

         messageToast.value = `Se eliminó el usuario ${res.data.data.c_name}`;
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
   <i class="bi bi-trash-fill cursor-pointer" data-bs-toggle="modal" :data-bs-target="`#deleteUser${props.idUser}`"
      @click="openModal();"></i>

   <!-- Modal -->
   <div class="modal fade" :id="`deleteUser${props.idUser}`" data-bs-backdrop="static" data-bs-keyboard="false"
      tabindex="-1" :aria-labelledby="`deleteUser${props.idUser}Label`" aria-hidden="true">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h1 class="modal-title fs-4" :id="`deleteUser${props.idUser}Label`">Eliminar usuario</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <p class="fs-3">¿Esta seguro de eliminar el usuario?</p>

               <p v-if="errorMsg" class="text-danger">{{ errorMsg }}</p>

               <div class="mb-3 text-center">
                  <button type="button" class="btn btn-danger px-5 me-3" @click="deleteUser()">Eliminar</button>
                  <button type="button" :id="`btnClosedeleteUser${props.idUser}Modal`" class="btn btn-secondary px-5"
                     data-bs-dismiss="modal">Cerrar</button>
               </div>
            </div>
         </div>
      </div>
   </div>

   <Toast v-if="viewToast" title="Eliminado" :message="messageToast" :view-toast="viewToast" />
</template>