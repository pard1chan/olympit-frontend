<template>
  <li class="course-materials-item">
    {{ title }}
    <IconButton class="course-materials-item__icon" @click="handleDownload" :icon-component="IconDownload" />
  </li>
</template>

<script setup>
import { IconDownload } from '@/shared/ui/Icons';
import { useFileDownload } from '../../composables/useFileDownload';
import IconButton from '@/shared/ui/IconButton';

const props = defineProps({
  link: String,
  materialId: String,
  courseId: String,
  title: String,
})

const { downloadFile, loading } = useFileDownload()

const handleDownload = async () => {
  await downloadFile(props.courseId, props.materialId, props.title)
}
</script>

<style lang="scss" scoped>
@use "sass:color";

.course-materials-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;


  @include hover {
    text-decoration: underline;

    .course-materials-item__icon {
      scale: 1.1;
    }
  }


}
</style>