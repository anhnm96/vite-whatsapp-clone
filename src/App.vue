<template>
  <div class="app">
    <router-view />
    <div
      v-show="loadingUser"
      class="fixed inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
    >
      <BSpinner class="w-40 h-40" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from './firebase'
import {
  loadingUser,
  createUserProfileDocument,
  setUser,
  user,
} from '@/hooks/useAuthUser'
import { User } from './types'
import { setupUseWindowSize } from '@/hooks/useWindowSize'

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter()
    loadingUser.value = true

    const unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth)
        userRef?.onSnapshot((snapShot) => {
          const data = snapShot.data() as User
          const { name, email, photoURL, timestamp } = data
          setUser({ id: snapShot.id, name, email, photoURL, timestamp })
          loadingUser.value = false
          // TODO: spinner, vuex from
        })
      } else {
        setUser(null)
        router.push('/login')
        loadingUser.value = false
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
    return { loadingUser }
  },
})
</script>

<style>
</style>
