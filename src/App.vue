<template>
  <div>
    <router-view />
    {{ user }}
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from './firebase'
import useAuthUser from '@/hooks/useAuthUser'
import { User } from './types'

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter()
    const { user, createUserProfileDocument, setUser } = useAuthUser()

    const unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        console.log('if', userAuth)
        const userRef = await createUserProfileDocument(userAuth)
        userRef?.onSnapshot((snapShot) => {
          const data = snapShot.data() as User
          console.log('data', data)
          const { name, email, photoURL, timestamp } = data
          setUser({ id: snapShot.id, name, email, photoURL, timestamp })
          console.log(snapShot.data())
          // TODO: spinner, vuex from
        })
      } else {
        console.log('else', userAuth)
        setUser(userAuth)
        router.push('/login')
      }
    })
    onBeforeUnmount(() => unsubscribeFromAuth())
    return { user }
  },
})
</script>

<style>
</style>
