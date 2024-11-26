<script lang="ts" setup>
import { Ref, ref } from 'vue';

const props = defineProps<{
   title: string;
   message: string;
   viewToast: boolean
}>();

let viewToast: Ref<boolean> = ref(props.viewToast);

setTimeout(() => {
   viewToast.value = false;
}, 3000);

</script>

<template>
   <div v-if="viewToast" class="position-fixed px-5 pt-2 text-center text-white toast-component">
      <p class="fs-5 fw-bold">{{ props.title }}</p>
      <p class="mb-2">{{ props.message }}</p>
   </div>
</template>

<style>
.toast-component {
   background-color: #76db9b;
   border-radius: 10px;
   right: 15px;
   top: 15px;
}
</style>