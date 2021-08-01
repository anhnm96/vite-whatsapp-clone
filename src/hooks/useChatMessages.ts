import { db } from '../firebase'
import { ref } from 'vue'

export default function useChatMessages(roomId?: string) {
  const messages = ref<any[]>([])
  if (!roomId) return messages
  db.collection('rooms')
    .doc(roomId)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot((querySnapshot) => {
      const updatedArr: any[] = []
      querySnapshot.forEach((doc) => {
        updatedArr.push({ id: doc.id, ...doc.data() })
      })
      messages.value = updatedArr
    })

  return messages
}
