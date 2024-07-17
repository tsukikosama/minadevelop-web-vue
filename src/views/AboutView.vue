<template>
  <div class="about" v-show="isVisible">
    asdasdasdasdasd
    <el-span >asdasdasd</el-span>
  </div>
</template>

<script lang="ts" setup>
import {computed, getCurrentInstance, onMounted, watch} from "vue";

const emit = defineEmits(['success', 'update:visible']);
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});
// const ctx = getCurrentInstance();
// const bus = ctx?.appContext.config.globalProperties.$bus;
// onMounted(() => {
//   bus.on('update:view',()=>{
//     console.log('update:view')
//     props.visible = true;
//   })
// })
const isVisible = computed({
  get: () => props.visible,
  set: (val) => {

    // formRef.value?.resetFields();
    emit('update:visible', val);

  },
});
watch(
    () => props.visible,
    (val) => {

      if (val) {
        // getDetail(val);
      }
    }
);
</script>
