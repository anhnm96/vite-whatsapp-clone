<template>
  <RefreshIcon class="animate-spin" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RefreshIcon } from '@heroicons/vue/outline'

export default defineComponent({
  name: 'BSpinner',
  components: { RefreshIcon },
})
</script>

<style>
</style>
