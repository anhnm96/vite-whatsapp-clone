<template>
  <div class="login">
    <div class="login__container">
      <img
        class="mx-auto"
        src="/src/assets/login-logo.png"
        alt="Logo"
      >
      <div class="login__text">
        <h1>Sign in to WhatsApp</h1>
      </div>
      <button
        class="flex space-x-2 btn-login disabled:opacity-50"
        @click="login"
      >
        <span>Sign in with Google</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { useRouter } from 'vue-router'
import { auth, provider } from '@/firebase'
import { user } from '@/hooks/useAuthUser'
import Logo from '@/assets/login-logo.png'

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    function login() {
      auth.signInWithPopup(provider)
    }

    watch(user, (newVal) => {
      if (newVal) {
        router.replace('/')
      }
    })

    return { login }
  },
})
</script>

<style scoped>
.login {
  background-color: #f8f8f8;
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
}

.login__container {
  padding: 100px;
  text-align: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.login__container > img {
  object-fit: contain;
  height: 100px;
  margin-bottom: 40px;
}

.login__container > button {
  margin-top: 50px;
  text-transform: inherit;
  background-color: rgba(16, 185, 129, 1);
  color: white;
  font-size: 1rem;
  line-height: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 0.25rem;
  font-weight: 600;
  border-style: none;
  cursor: pointer;
}

@media (max-width: 760px) {
  .login__container {
    padding: 100px 50px;
  }
  .login__text > h1 {
    font-size: 28px;
    width: 100%;
  }
}

@media (max-width: 435px) {
  .login__container {
    padding: 50px 25px;
  }
}
</style>
