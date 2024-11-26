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
   user: User,
   idProject: number | undefined
}>();

const update = () => {
   project.fk_user = props.user.pk_user;
   projectService.updateProject(project).then((res: any) => {
      if (res.data) {
         let btnCloseModal = document.getElementById(`btnCloseEdit${props.idProject}Modal`);
         btnCloseModal?.click();

         emit('reloadData', true);

         messageToast.value = `Se actualizó el proyecto ${res.data.data.c_name}`;
         viewToast.value = true;
         project = reactive<Project>({});
      } else {
         errorMsg.value = res.response.data.message;
      }
   });
}

const openModal = () => {
   viewToast.value = false;

   projectService.getProject(props.idProject).then((res: any) => {
      if (res.data) {
         project.pk_project = res.data.data.pk_project;
         project.c_name = res.data.data.c_name;
      } else {
         errorMsg.value = res.response.data.message;
      }
   });
}
</script>

<template>
   <i class="bi bi-pencil-square cursor-pointer" style="color: #000" data-bs-toggle="modal"
      :data-bs-target="`#updateProject${props.idProject}`" @click="openModal();"></i>

   <!-- Modal -->
   <div class="modal fade" :id="`updateProject${props.idProject}`" data-bs-backdrop="static" data-bs-keyboard="false"
      tabindex="-1" :aria-labelledby="`updateProject${props.idProject}Label`" aria-hidden="true">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h1 class="modal-title fs-4" :id="`updateProject${props.idProject}Label`">Actualizar proyecto</h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
               <form @submit.prevent="update()">
                  <div class="mb-3 text-start">
                     <label for="editName" class="form-label">Nombre</label>
                     <input type="text" class="form-control" id="editName" v-model="project.c_name" required>
                  </div>

                  <p v-if="errorMsg" class="text-danger">{{ errorMsg }}</p>

                  <div class="mb-3 text-center">
                     <button type="submit" id="btnOpenModal" class="btn btn-primary px-5 me-3">Actualizar</button>
                     <button type="button" :id="`btnCloseEdit${props.idProject}Modal`" class="btn btn-secondary px-5"
                        data-bs-dismiss="modal">Cerrar</button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   </div>

   <Toast v-if="viewToast" title="Actualizado" :message="messageToast" :view-toast="viewToast" />
</template>