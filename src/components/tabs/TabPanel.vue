<template>
  <div class="w-full h-100vh overflow-hidden">
    <!-- <slot v-if="$slots.default"></slot> -->
    <!-- <span v-else>{{ content }}</span> -->
    <div v-if="isLoading" class="mt-48px text-align-center">Loading...</div>
    <iframe
      :src="content"
      width="100%"
      height="100%"
      frameborder="0"
      @load="handleLoad"
      :style="{ display: isLoading ? 'none' : 'block' }"></iframe>
  </div>
</template>

<script lang="ts" setup>
const { content } = defineProps<{
  content?: string
}>()
const isLoading = ref(true)

const handleLoad = () => {
  isLoading.value = false
}

watch(
  () => content,
  () => {
    isLoading.value = true
  }
)
</script>
