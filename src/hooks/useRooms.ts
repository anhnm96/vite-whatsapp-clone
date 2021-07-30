import { db } from "@/firebase"
import { ref } from 'vue'

export const rooms = ref()

db.collection("rooms").orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
  const newRooms: any[] = []
  console.log(querySnapshot)
  rooms.value = querySnapshot.forEach(doc => {
    newRooms.push({
      id: doc.id,
      userID: doc.id,
      ...doc.data()
    })
  })
  rooms.value = newRooms
})
