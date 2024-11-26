<script lang="ts" setup>
import Toast from '@/components/Toast.vue';
import { Project } from '@/interfaces/Project';
import { User } from '@/interfaces/User';
import { ProjectApi } from '@/services/api/projects/projects';
import { reactive, ref, Ref } from 'vue';

let project: Project = reactive<Project>({});
const projectService: ProjectApi = new ProjectApi();

let errorMsg: Ref<string> = ref('');

let messageToast: Ref<string> = ref('');
let viewToast: Ref<boolean> = ref(false);

const emit = defineEmits<{
   (event: 'reloadData', payload: boolean): void;
}>();

const props = defineProps<{
   user: User
}>();

const insert = () => {
   project.fk_user = props.user.pk_user;
   projectService.insertProject(project).then((res: any) => {
      if (res.data) {
         let btnCloseModal = document.getElementById('btnCloseModal');
         btnCloseModal?.click();

         emit('reloadData', true);

         messageToast.value = `Se creó el proyecto ${res.data.data.c_name}`;
         viewToast.value = true;
         project = reactive<Project>({});
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
   <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createProyect"
      @click="openModal();">
      Crear proyecto
   </button>

   <!-- Modal -->
   <div class="modal fade" id="createProyect" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
      aria-labelledby="createProyectLabel" aria-hidden="true">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h1 class="modal-title fs-4" id="createProyectLabel">Crear un proyecto</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <form @submit.prevent="insert()">
                  <div class="mb-3 text-start">
                     <label for="name" class="form-label">Nombre</label>
                     <input type="text" class="form-control" id="name" v-model="project.c_name" required>
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