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

const props = defineProps<{
   roles: Role[]
}>();

const emit = defineEmits<{
   (event: 'reloadData', payload: boolean): void;
}>();

const insert = () => {
   userService.insertUser(newUser).then((res: any) => {
      if (res.data) {
         let btnCloseModal = document.getElementById('btnCloseCreateUserModal');
         btnCloseModal?.click();

         emit('reloadData', true);

         messageToast.value = `Se creó el usuario ${res.data.data.c_email}`;
         viewToast.value = true;
         newUser = reactive<Task>({});
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
   <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createUser"
      @click="openModal();">
      Crear Usuario
   </button>

   <!-- Modal -->
   <div class="modal fade" id="createUser" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
      aria-labelledby="createUserLabel" aria-hidden="true">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h1 class="modal-title fs-4" id="createUserLabel">Crear un usuario</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <form @submit.prevent="insert()">
                  <div class="mb-3 text-start">
                     <label for="nameCreate" class="form-label">Nombre</label>
                     <input type="text" class="form-control" id="nameCreate" v-model="newUser.c_name" required>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="emailCreate" class="form-label">Correo</label>
                     <input type="email" class="form-control" id="emailCreate" v-model="newUser.c_email" required>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="passwordCreate" class="form-label">Contraseña</label>
                     <input type="password" class="form-control" id="passwordCreate" v-model="newUser.c_password"
                        required>
                  </div>

                  <div class="mb-3 text-start">
                     <label for="userResponsibleCreate" class="form-label">Seleccione un rol</label>
                     <select class="form-select" id="userResponsibleCreate" aria-label="Seleccione un rol"
                        v-model="newUser.fk_role">
                        <option v-for="role of roles" :value="role.pk_role">
                           {{ role.c_name }}
                        </option>
                     </select>
                  </div>

                  <p v-if="errorMsg" class="text-danger">{{ errorMsg }}</p>

                  <div class="mb-3 text-center">
                     <button type="submit" class="btn btn-primary px-5 me-3">Crear</button>
                     <button type="button" id="btnCloseCreateUserModal" class="btn btn-secondary px-5"
                        data-bs-dismiss="modal">Cerrar</button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   </div>

   <Toast v-if="viewToast" title="Guardado" :message="messageToast" :view-toast="viewToast" />
</template>