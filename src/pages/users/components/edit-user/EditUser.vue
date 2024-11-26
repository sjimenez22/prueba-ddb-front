<script lang="ts" setup>
import Toast from '@/components/Toast.vue';
import { Role } from '@/interfaces/Role';
import { Task } from '@/interfaces/Task';
import { User } from '@/interfaces/User';
import { UserApi } from '@/services/api/users/users';
import { reactive, ref, Ref } from 'vue';

let newUser: User = reactive<User>({});
const userService: UserApi = new UserApi();

let errorMsg: Ref<string> = ref('');

let messageToast: Ref<string> = ref('');
let viewToast: Ref<boolean> = ref(false);

const emit = defineEmits<{
   (event: 'reloadData', payload: boolean): void;
}>();

const props = defineProps<{
   idUser: number | undefined,
   roles: Role[]
}>();

const update = () => {
   userService.updateUser(newUser).then((res: any) => {
      if (res.data) {
         let btnCloseModal = document.getElementById(`btnCloseEdit${props.idUser}Modal`);
         btnCloseModal?.click();

         emit('reloadData', true);

         messageToast.value = `Se actualizó el usuario ${res.data.data.c_email}`;
         viewToast.value = true;
         newUser = reactive<Task>({});
      } else {
         errorMsg.value = res.response.data.message;
      }
   });
}

const openModal = () => {
   viewToast.value = false;

   userService.getUser(props.idUser).then((res: any) => {
      if (res.data) {
         newUser.pk_user = res.data.data.pk_user;
         newUser.c_name = res.data.data.c_name;
         newUser.c_email = res.data.data.c_email;
         newUser.fk_role = res.data.data.role.pk_role;
      } else {
         errorMsg.value = res.response.data.message;
      }
   });
}
</script>

<template>
   <i class="bi bi-pencil-square cursor-pointer" style="color: #000" data-bs-toggle="modal"
      :data-bs-target="`#updateUser${props.idUser}`" @click="openModal();"></i>

   <!-- Modal -->
   <div class="modal fade" :id="`updateUser${props.idUser}`" data-bs-backdrop="static" data-bs-keyboard="false"
      tabindex="-1" :aria-labelledby="`updateUser${props.idUser}Label`" aria-hidden="true">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h1 class="modal-title fs-4" :id="`updateUser${props.idUser}Label`">Actualizar usuario</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <form @submit.prevent="update()">
                  <div class="mb-3 text-start">
                     <label for="nameUpdate" class="form-label">Nombre</label>
                     <input type="text" class="form-control" id="nameUpdate" v-model="newUser.c_name" required>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="emailUpdate" class="form-label">Correo</label>
                     <input type="email" class="form-control" id="emailUpdate" v-model="newUser.c_email" required>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="passwordUpdate" class="form-label">Contraseña</label>
                     <input type="password" class="form-control" id="passwordUpdate" v-model="newUser.c_password">
                  </div>

                  <div class="mb-3 text-start">
                     <label for="userResponsibleUpdate" class="form-label">Seleccione un rol</label>
                     <select class="form-select" id="userResponsibleUpdate" aria-label="Seleccione un rol"
                        v-model="newUser.fk_role">
                        <option v-for="role of roles" :value="role.pk_role">
                           {{ role.c_name }}
                        </option>
                     </select>
                  </div>
                  <p v-if="errorMsg" class="text-danger">{{ errorMsg }}</p>

                  <div class="mb-3 text-center">
                     <button type="submit" class="btn btn-primary px-5 me-3">Actualizar</button>
                     <button type="button" :id="`btnCloseEdit${props.idUser}Modal`" class="btn btn-secondary px-5"
                        data-bs-dismiss="modal">Cerrar</button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   </div>

   <Toast v-if="viewToast" title="Actualizado" :message="messageToast" :view-toast="viewToast" />
</template>