<template>
  <div class="avatar">
    <img
      class="avatar-img"
      :src="src"
      :alt="alt"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseAvatar',
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: 'avatar',
    },
  },
})
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  display: flex;
  position: relative;
  overflow: hidden;
  font-size: 1.25rem;
  align-items: center;
  line-height: 1;
  user-select: none;
  border-radius: 50%;
  justify-content: center;
}

.avatar-img {
  color: transparent;
  width: 100%;
  height: 100%;
  object-fit: cover;
  text-align: center;
}
</style>
