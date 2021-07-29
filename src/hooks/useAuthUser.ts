import { db, firebase, createTimestamp } from '@/firebase'
import { ref } from 'vue'
import { User } from '@/types'

export default function useAuthUser() {
  const user = ref<User | null>()

  const createUserProfileDocument = async (
    userAuth: firebase.User | null,
    additionalData?: any
  ) => {
    if (!userAuth) return
    const userRef = db.doc(`users/${userAuth.uid}`)
    const snapshot = await userRef.get()
    if (!snapshot.exists) {
      const { displayName, email, photoURL } = userAuth
      const timestamp = createTimestamp()
      try {
        await userRef.set({
          displayName,
          email,
          timestamp,
          photoURL,
          ...additionalData,
        })
      } catch (error) {
        console.log('error creating user', error.message)
      }
    }
    return userRef
  }

  function setUser(newValue: User | null) {
    user.value = newValue
  }

  return { user, createUserProfileDocument, setUser }
}
