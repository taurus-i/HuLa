<template>
  <div class="relative flex-col w-full h-full">
    <div class="py-24px border-b-(1px solid [--line-color]) border-t-(1px solid [--line-color])">
      <TabBar
        :tabs="tabs"
        :activeTabId="activeTabId"
        @update-active="setActiveTab"
        @add-tab="addTab"
        @close-tab="closeTab" />
    </div>
    <TabPanel :content="activeTabContent"></TabPanel>
  </div>
</template>

<script lang="ts" setup>
import Mitt from '~/src/utils/Bus'

interface Tab {
  id: number
  title: string
  content: string
}

const tabs = ref<Tab[]>([
  {
    id: 1,
    title: 'Satoshi',
    content: 'https://great-satoshi.vercel.app/'
  }
])

const activeTabId = ref<number>(tabs.value[0].id)

const setActiveTab = (id: number) => {
  activeTabId.value = id
}

const addTab = (targetUrl?: string) => {
  const newTab = { id: Date.now(), title: 'New Tab', content: targetUrl ?? '' }
  tabs.value.push(newTab)
  activeTabId.value = newTab.id
}

const closeTab = (id: number) => {
  if (tabs.value.length === 1) return
  const index = tabs.value.findIndex((tab) => tab.id === id)
  if (index !== -1) {
    tabs.value.splice(index, 1)
    if (activeTabId.value === id && tabs.value.length) {
      activeTabId.value = tabs.value[Math.max(0, index - 1)].id
    }
  }
}

const activeTabContent = computed(() => {
  return tabs.value.find((tab) => tab.id === activeTabId.value)?.content
})

Mitt.on('ADD_TAB', (event) => {
  addTab(event as string)
})
</script>
