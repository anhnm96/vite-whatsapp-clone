<template>
  <button class="btn-icon">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseButtonIcon',
})
</script>

<style>
.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  background: transparent;
}

svg {
  display: flex;
  width: 24px;
  height: 24px;
}
</style>
