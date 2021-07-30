<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from './firebase'
import { user, createUserProfileDocument, setUser } from '@/hooks/useAuthUser'
import { User } from './types'
import { setupUseWindowSize } from '@/hooks/useWindowSize'

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter()

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

    let removeUseWindowSizeEvent: Function
    onMounted(() => {
      removeUseWindowSizeEvent = setupUseWindowSize()
    })

    onBeforeUnmount(() => {
      unsubscribeFromAuth()
      removeUseWindowSizeEvent()
    })
    return { user }
  },
})
</script>

<style>
</style>
