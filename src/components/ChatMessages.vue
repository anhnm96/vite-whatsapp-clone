<template>
  <div>
    <div
      v-for="message in messages"
      :key="message.id"
      :class="['chat__message', message.uid === user?.id ? 'chat__message--sender' : '']"
    >
      <span class="chat__name">{{ message.name }}</span>

      <div
        v-if="message.imageUrl === 'uploading'"
        class="image-container"
      >
        <div class="flex justify-center text-gray-400">
          <BSpinner class="w-10 h-10" />
        </div>
      </div>
      <div
        v-else-if="message.imageUrl"
        class="image-container"
      >
        <img
          :src="message.imageUrl"
          :alt="message.name"
        >
      </div>

      <AudioPlayer
        v-if="message.audioUrl"
        :id="message.id"
        :is-sender="message.id === user?.id"
        :audio-url="message.audioUrl"
      />
      <span
        v-else
        class="chat__message--message"
      >{{ message.message }}</span>

      <span class="chat__timestamp">{{ message.time }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { User, Message } from '@/types'
import AudioPlayer from './AudioPlayer.vue'

export default defineComponent({
  name: 'ChatMessages',
  components: { AudioPlayer },
  props: {
    messages: {
      type: Array as PropType<Message[]>,
      required: true,
    },
    user: {
      type: Object as PropType<User | null | undefined>,
      required: true,
    },
  },
})
</script>

<style scoped>
.chat__message {
  z-index: 0;
  position: relative;
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  background-color: #ffffff;
  padding-top: 22px;
  word-wrap: break-word;
  max-width: 320px;
  margin-top: 4px;
}

.chat__message--message {
  margin-right: 10px;
}

.chat__message--sender {
  margin-left: auto;
  background-color: #dcf8c6;
}

.chat__lastMessage {
  margin-bottom: 30px;
  opacity: 0;
  animation: fade-in 300ms forwards 600ms;
}

.chat__name {
  position: absolute;
  top: 8px;
  left: 9px;
  font-weight: 500;
  font-size: 10.5px;
  color: grey;
}

.image-container {
  position: relative;
  max-height: 300px;
  max-width: 300px;
  overflow: hidden;
  margin: 10px 0;
  border-radius: 10px;
}

.image-container img {
  /*object-fit: cover;*/
  width: 100%;
  /* position: absolute; */
  /* left: 50%; */
  /* top: 50%; */
  /* transform: translateX(-50%) translateY(-50%); */
}

.chat__message img {
  cursor: pointer;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.chat__timestamp {
  font-size: 10px;
  text-align: right;
  color: grey;
}
</style>
