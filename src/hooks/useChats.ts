import { db } from '@/firebase'
import { ref, watch, Ref } from 'vue'
import { User } from '@/types'

export default function useChats(authUser: Ref<User | null | undefined>) {
  const chats = ref<any[]>([])

  watch(
    authUser,
    (newVal) => {
      if (newVal) {
        db.collection('users')
          .doc(newVal.id)
          .collection('chats')
          .orderBy('timestamp', 'desc')
          .onSnapshot((querySnapshot) => {
            const updatedChats: any[] = []
            querySnapshot.forEach((doc) => {
              updatedChats.push({
                id: doc.id,
                ...doc.data(),
              })
            })
            chats.value = updatedChats
          })
      }
    },
    { immediate: true }
  )

  return chats
}
