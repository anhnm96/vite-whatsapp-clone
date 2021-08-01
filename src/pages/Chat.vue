<template>
  <div
    v-if="room"
    class="relative flex-grow chat"
  >
    <div
      class="chat__background"
      :style="{height}"
    />
    <div class="chat__header">
      <BButtonIcon
        v-if="isMobile"
        :disabled="disabledBack"
        @click="$router.back()"
      >
        <ArrowLeftIcon />
      </BButtonIcon>
      <div class="avatar__container">
        <BAvatar :src="room?.photoURL" />
      </div>

      <div class="chat__header--info">
        <h3 :style="{width: isMobile ? width - 165 : undefined}">
          {{ room?.name }}
        </h3>
      </div>

      <div class="chat__header--right">
        <input
          id="image"
          class="hidden"
          accept="image/*"
          type="file"
          @change="showPreview"
        >
        <BButtonIcon>
          <label
            class="h-6 cursor-pointer"
            for="image"
          >
            <PhotographIcon />
          </label>
        </BButtonIcon>
        <BButtonIcon>
          <DotsVerticalIcon />
        </BButtonIcon>
      </div>
    </div>

    <div className="chat__body--container">
      <div
        className="chat__body"
        :style="{height: height - 68}"
      >
        <ChatMessages
          :messages="messages"
          :user="user"
          :room-id="roomId"
        />
      </div>
    </div>

    <MediaPreview
      v-if="src"
      :src="src"
      @closePreview="closePreview"
    />

    <ChatFooter
      :image="image"
      :user="user"
      :room="room"
      :room-id="roomId"
      @send="send"
    />
    <!-- <div v-if="isDeleting" className="chat__deleting">
          <CircularProgress />
        </div> -->
  </div>
</template>
  
<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { user } from '@/hooks/useAuthUser'
import useRoom from '@/hooks/useRoom'
import { useWindowSize } from '@/hooks/useWindowSize'
import useChatMessages from '@/hooks/useChatMessages'
import {
  PhotographIcon,
  DotsVerticalIcon,
  ArrowLeftIcon,
} from '@heroicons/vue/outline'
import ChatMessages from '@/components/ChatMessages.vue'
import MediaPreview from '@/components/MediaPreview.vue'
import ChatFooter from '@/components/ChatFooter.vue'
import { v4 as uuid } from 'uuid'
import { audioStorage, createTimestamp, db, storage } from '@/firebase'
import Compressor from 'compressorjs'

export default defineComponent({
  name: 'Chat',
  components: {
    PhotographIcon,
    DotsVerticalIcon,
    ArrowLeftIcon,
    ChatMessages,
    MediaPreview,
    ChatFooter,
  },
  setup() {
    const route = useRoute()
    const { isMobile, width, height } = useWindowSize()
    const roomId = route.params.id as string
    const room = useRoom(roomId, user)
    const messages = useChatMessages(roomId)
    const image = ref()
    const src = ref('')

    const disabledBack = computed(() => {
      // eslint-disable-next-line
      let _path = route.path
      return window.history.state.back === null
    })

    function showPreview(event: Event) {
      const target = event.target as HTMLInputElement
      const file: File = (target.files as FileList)[0]

      if (file) {
        image.value = file
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          src.value = reader.result as string
        }
      }
    }

    function closePreview() {
      src.value = ''
      image.value = null
    }

    async function send(text: string) {
      if (!user.value) return
      if (text.trim() || (text === '' && image.value)) {
        const imageName = uuid()
        const newMessage = image.value
          ? {
              name: user.value.name,
              message: text,
              uid: user.value.id,
              timestamp: createTimestamp(),
              time: new Date().toUTCString(),
              imageUrl: 'uploading',
              imageName,
            }
          : {
              name: user.value.name,
              message: text,
              uid: user.value.id,
              timestamp: createTimestamp(),
              time: new Date().toUTCString(),
            }

        db.collection('users')
          .doc(user.value.id)
          .collection('chats')
          .doc(roomId)
          .set({
            name: room.value.name,
            photoURL: room.value.photoURL || null,
            timestamp: createTimestamp(),
          })

        const doc = await db
          .collection('rooms')
          .doc(roomId)
          .collection('messages')
          .add(newMessage)

        if (image.value) {
          new Compressor(image.value, {
            quality: 0.8,
            maxWidth: 1920,
            async success(result) {
              closePreview()
              await storage.child(imageName).put(result)
              const url = await storage.child(imageName).getDownloadURL()
              db.collection('rooms')
                .doc(roomId)
                .collection('messages')
                .doc(doc.id)
                .update({
                  imageUrl: url,
                })
            },
          })
        }
      }
    }

    const isDeleting = ref(false)
    async function deleteRoom() {
      isDeleting.value = true
      try {
        const roomRef = db.collection('rooms').doc(roomId)
        const roomMessages = await roomRef.collection('messages').get()
        const audioFiles: any[] = []
        const imageFiles: any[] = []
        roomMessages.docs.forEach((doc) => {
          if (doc.data().audioName) {
            audioFiles.push(doc.data().audioName)
          } else if (doc.data().imageName) {
            imageFiles.push(doc.data().imageName)
          }
        })

        await Promise.all([
          ...roomMessages.docs.map((doc) => doc.ref.delete()),
          ...imageFiles.map((image) => storage.child(image).delete()),
          ...audioFiles.map((audio) => audioStorage.child(audio).delete()),
          db
            .collection('users')
            .doc(user.value?.id)
            .collection('chats')
            .doc(roomId)
            .delete(),
          roomRef.delete(),
        ])
      } catch (error) {
        console.error('Error deleting room: ', error.message)
      } finally {
        isDeleting.value = false
        // isMobile ? router.back() : router.replace("/chats");
      }
    }

    return {
      disabledBack,
      user,
      roomId,
      src,
      showPreview,
      closePreview,
      room,
      height,
      width,
      isMobile,
      messages,
      image,
      send,
    }
  },
})
</script>

<style scoped>
.chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #e5ddd5;
}

.page-enter {
  opacity: 0;
  transform: scale(0.9) translateZ(456px);
}

.page-enter-active {
  opacity: 1;
  transform: scale(1) translateZ(456px);
  transition: transform 300ms, opacity 300ms;
}

.page-exit {
  opacity: 1;
  transform: scale(1);
}

.page-exit-active {
  opacity: 0;
  transform: scale(0.9) translateZ(456px);
  transition: transform 300ms, opacity 300ms;
}

.chat__background {
  background-image: url('https://web.whatsapp.com/img/bg-chat-tile-light_686b98c9fdffef3f63127759e2057750.png');
  background-size: contain;
  background-position: center;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.06;
}

.chat__header {
  padding: 10px;
  padding-right: 0px;
  padding-left: 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid lightgrey;
  background-color: #ededed;
  z-index: 1;
}

.chat__header--info {
  flex: 1;
  margin-left: 8px;
}

.chat__header--info > h3 {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 200px;
}

.chat__header--info > p {
  color: grey;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 200px;
  font-size: 13px;
}

.chat__header--right {
  display: flex;
  justify-content: space-between;
  min-width: 50px;
}

.chat__header--right > .MuiButtonBase-root {
  padding: 12px;
}

.chat__body--container {
  /* flex: 1; */
  background-repeat: repeat;
  background-position: center;
  overflow: scroll;
  background-color: transparent;
  z-index: 1;
  position: relative;
  height: calc(100% - 125px);
}

.chat__body {
  /* opacity: 0; */
  /* background-color: transparent; */
  padding: 0px 60px;
  padding-bottom: 98px !important;
  transition: opacity 200ms;
  position: relative;
}

.chat__body--container::-webkit-scrollbar {
  display: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.paginateLoader {
  background: transparent !important;
}

.paginateLoader > div > .MuiCircularProgress-svg {
  transform: scale(1);
  /*display: none;*/
}

.scroll {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  left: 50%;
  bottom: 78px;
  transform: translateX(-50%) scale(1);
  transition: transform 150ms;
  z-index: 1;
  box-shadow: 0px 0px 2px 0px #00000087;
  cursor: pointer;
}

.scroll svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.scroll div {
  position: absolute;
  top: 0;
  right: 0;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background-color: #06d755;
  color: white;
  font-size: 10px;
  font-weight: 500;
  display: grid;
  place-items: center;
  color: white;
}

.scroll-enter {
  transform: translateX(-50%) scale(0.7);
  opacity: 0;
}

.scroll-enter-active {
  opacity: 1;
  transform: translateX(-50%) scale(1);
  transition: opacity 300ms, transform 300ms;
}

.scroll-exit {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.scroll-exit-active {
  opacity: 0;
  transform: translateX(-50%) scale(0.7);
  transition: opacity 300ms, transform 300ms;
}

.chat__deleting {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background-color: #ffffff6c;
  z-index: 2;
}

.seen {
  position: absolute;
  height: 30px;
  width: 94px;
  right: 60px;
  bottom: 58px;
  opacity: 0 !important;
}

.seen-animate-enter {
  opacity: 0 !important;
}

.seen-animate-enter-active {
  opacity: 1 !important;
  transition: opacity 200ms;
}

.seen-animate-exit {
  opacity: 0 !important;
}

.seen-animate-exit-active {
  opacity: 0 !important;
}

.seen-animate-enter-done {
  opacity: 1 !important;
}

.seen p {
  background-color: #dcf8c6;
  padding: 3px 15px;
  text-align: center;
  position: absolute;
  right: 0;
  border-radius: 10px;
}

.seen span {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.seen .MuiSvgIcon-root {
  transform: scale(0.9);
  margin-left: 5px;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (min-width: 761px) {
  .chat__header--info > h3 {
    width: 350px;
  }

  .chat__header--info > p {
    width: 350px;
  }
}

@media (max-width: 760px) {
  .seen {
    right: 20px;
  }
  .chat {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #e5ddd5;
    opacity: 1;
    transform: scale(1);
    transition: transform 250ms cubic-bezier(0.37, 0, 0.63, 1),
      opacity 250ms cubic-bezier(0.37, 0, 0.63, 1);
  }

  .chat__body {
    padding: 0px 20px;
  }

  .image-container .MuiCircularProgress-svg {
    transform: scale(1.5) !important;
  }
  .chat__header {
    padding: 10px;
    padding-left: 8px;
  }
  .chat__header--right > .MuiButtonBase-root {
    padding: 8px;
  }
  .chat__header > .MuiButtonBase-root {
    padding: 0px;
    padding-right: 5px;
    border-radius: 18.5px;
  }

  .chat__header--info > p,
  .chat__header--info > h3 {
    width: 180px;
  }
  .chat__header--info > p {
    font-size: 11px;
    font-weight: 400;
  }

  .page-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: transform 300ms cubic-bezier(0.37, 0, 0.63, 1),
      opacity 300ms cubic-bezier(0.37, 0, 0.63, 1);
  }

  .page-exit-active {
    opacity: 0;
    transform: scale(0.9);
    transition: transform 300ms cubic-bezier(0.37, 0, 0.63, 1),
      opacity 300ms cubic-bezier(0.37, 0, 0.63, 1);
  }
}
</style>
