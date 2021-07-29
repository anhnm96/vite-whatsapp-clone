import { db } from '@/firebase'

export default async function useUsers(user) {
  const snapshot = await db
    .collection('users')
    .orderBy('timestamp', 'desc')
    .get()

  const users = []

  if (user) {
    snapshot.forEach((doc) => {
      const id =
        doc.id > user.uid ? `${doc.id}${user.uid}` : `${user.uid}${doc.id}`

      if (doc.id !== user.uid) {
        users.push({
          id,
          userID: doc.id,
          ...doc.data(),
        })
      }
    })
  }

  return users
}
