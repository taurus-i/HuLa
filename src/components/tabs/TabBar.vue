<template>
  <n-scrollbar x-scrollable>
    <div
      ref="scrollContainer"
      :class="['flex gap-12px items-center pr-42px py-12px overflow-x-auto', { relative: !isAtRightEdge }]">
      <TabItem
        v-for="tab in tabs"
        :key="tab.id"
        :tab="tab"
        :isActive="tab.id === activeTabId"
        @select="selectTab(tab.id)"
        @close="closeTab(tab.id)" />
      <span
        ref="iconContainer"
        :class="[
          'flex-center absolute top-12px right-0 w-32px h-32px rounded-4px cursor-pointer bg-#ebebef hover:bg-[#dddde1] z-1'
        ]"
        @click="addNewTab"
        ><Plus :size="16"
      /></span>
    </div>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import { Plus } from 'lucide-vue-next'

interface Tab {
  id: number
  title: string
  content: string
}

const { tabs, activeTabId } = defineProps<{
  tabs: Tab[]
  activeTabId: number
}>()
const scrollContainer = ref<HTMLElement | null>(null)
const iconContainer = ref<HTMLElement | null>(null)
const isAtRightEdge = ref(false)
let resizeObserver: ResizeObserver | null = null

const checkIfAtRightEdge = () => {
  if (scrollContainer.value && iconContainer.value) {
    const containerRightEdge = scrollContainer.value.scrollLeft + scrollContainer.value.clientWidth
    const iconLeftEdge = iconContainer.value.offsetLeft
    isAtRightEdge.value = containerRightEdge >= iconLeftEdge - 5
  }
}

onMounted(() => {
  checkIfAtRightEdge()
  resizeObserver = new ResizeObserver(checkIfAtRightEdge)
  if (scrollContainer.value) resizeObserver.observe(scrollContainer.value)
  if (iconContainer.value) resizeObserver.observe(iconContainer.value)
})
onBeforeUnmount(() => {
  if (resizeObserver) {
    if (scrollContainer.value) resizeObserver.unobserve(scrollContainer.value)
    if (iconContainer.value) resizeObserver.unobserve(iconContainer.value)
    resizeObserver.disconnect()
  }
})

const emit = defineEmits<{
  (e: 'update-active', id: number): void
  (e: 'add-tab'): void
  (e: 'close-tab', id: number): void
}>()

const selectTab = (id: number) => {
  emit('update-active', id)
}

const addNewTab = async () => {
  emit('add-tab')
  await nextTick()
  checkIfAtRightEdge()
}

const closeTab = async (id: number) => {
  emit('close-tab', id)
  checkIfAtRightEdge()
}
</script>
