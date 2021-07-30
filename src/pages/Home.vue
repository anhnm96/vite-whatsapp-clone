<template>
  <div class="app__body">
    <Sidebar />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

export default defineComponent({
  name: 'Home',
  components: { Sidebar },
  props: {},
})
</script>

<style>
</style>
