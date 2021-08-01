import { db } from '@/firebase'
import { ref, watch, Ref } from 'vue'
import { User } from '@/types'

// export const users = ref<any[]>([])

export default function useUsers(authUser: Ref<User | null | undefined>) {
  const users = ref<any[]>([])

  watch(
    authUser,
    (newVal) => {
      if (newVal) {
        db.collection('users')
          .orderBy('timestamp', 'desc')
          .onSnapshot((querySnapshot) => {
            const updatedUsers: any[] = []
            querySnapshot.forEach((doc) => {
              if (newVal && doc.id !== newVal.id) {
                const id =
                  doc.id > newVal.id
                    ? `${doc.id}${newVal.id}`
                    : `${newVal.id}${doc.id}`
                updatedUsers.push({
                  id,
                  userID: doc.id,
                  ...doc.data(),
                })
              }
            })
            users.value = updatedUsers
          })
      }
    },
    { immediate: true }
  )

  return users
}
