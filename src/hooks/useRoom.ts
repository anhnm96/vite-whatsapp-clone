import { db } from '@/firebase'
import { ref, watch } from 'vue'

export default function useRoom(roomId: string, authUser: any) {
  const room = ref()

  watch(
    authUser,
    async (newVal) => {
      if (newVal) {
        const isUserRoom = roomId.includes(newVal.id)

        const doc = isUserRoom ? roomId?.replace(newVal.id, '') : roomId

        const snapshot = await db
          .collection(isUserRoom ? 'users' : 'rooms')
          .doc(doc)
          .get()

        if (!snapshot.exists) room.value = null
        else
          room.value = {
            id: snapshot.id,
            photoURL:
              snapshot.photoURL ||
              `https://avatars.dicebear.com/api/human/${snapshot.id}.svg`,
            ...snapshot.data(),
          }
      }
    },
    { immediate: true }
  )

  return room
}
