<template>
  <n-popover trigger="hover">
    <template #trigger>
      <div
        @click="select"
        :class="{ 'active-tab': isActive }"
        class="relative flex-1 min-w-100px p-8px cursor-pointer rounded-4px bg-[#ebebef] hover:bg-[#dddde1] text-align-center whitespace-nowrap overflow-hidden">
        <span class="select-none">{{ tab.title }} </span>
        <span v-show="tab.title !== 'Satoshi'" class="absolute right-4px top-10px cursor-pointer z-1">
          <X :size="14" @click.stop="close"
        /></span>
      </div>
    </template>
    <span> {{ tab.content.length > 0 ? tab.content : 'New Tab' }}</span>
  </n-popover>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import { X } from 'lucide-vue-next'

interface Tab {
  id: number
  title: string
  content: string
}

const { tab, isActive } = defineProps<{
  tab: Tab
  isActive: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
  (e: 'close'): void
}>()

const select = () => {
  emit('select')
}

const close = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.active-tab {
  background-color: #f7f7f9;
}
</style>
