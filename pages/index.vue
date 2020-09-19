<template lang="pug">
  section.container
    form#signIn(@submit="checkForm", @keydown.enter.prevent="checkForm")
      p
        label(for="name") Логин
        input#login(v-model="login" type="text" name="login")
      p
        label(for="age") Пароль
        input#password(v-model="password" type="password" name="password" min="0")
      button(type="submit") Отправить
      div(v-if="errors.length")
        ul
          li(v-for="item in errors" :key="item.id") {{item}}
</template>

<script>

import axios from 'axios'

export default {

  data () {
    return {
      errors: [],
      login: null,
      password: null
    }
  },
  created () {

  },
  methods: {
       checkForm(e) {
        if (this.login && this.password) {
          this.$store.dispatch(
            'common/auth', {
               login: this.login,
               password : this.password })
          .then(data => {
            if (data.status === 'success') {
                 this.$router.push({ path: '/inside' })
            } else {
                if (data.data === 'Login failed') alert('Login failed')
                if (data.data === 'Password failed') alert('Password failed')
            }

          }).catch(error => console.log(error))
        }
          this.errors = []
          if (!this.login) this.errors.push('Введите Логин');
          if(!this.password) this.errors.push('Введите пароль')

           e.preventDefault();

    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
