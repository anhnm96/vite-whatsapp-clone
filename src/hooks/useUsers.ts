import { db } from '@/firebase'
import { user } from './useAuthUser'
import { ref } from 'vue'

export const users = ref<any[]>([])
db.collection('users')
  .orderBy('timestamp', 'desc')
  .onSnapshot((querySnapshot) => {
    console.log(querySnapshot)
    querySnapshot.forEach(doc => {
      const updatedUsers: any[] = []


      if (user.value && doc.id !== user.value.id) {
        const id =
          doc.id > user.value.id ? `${doc.id}${user.value.id}` : `${user.value.id}${doc.id}`
        updatedUsers.push({
          id,
          userID: doc.id,
          ...doc.data(),
        })
      }

      console.log(updatedUsers)
      users.value = updatedUsers
    })
  })

