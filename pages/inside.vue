<template lang="pug">
  section.container
    p Авторизация прошла успешно
    button(@click.prevent = 'logout') Выход
</template>

<script>

 import { mapGetters } from 'vuex'
 import axios from 'axios'

export default {
name: 'Inside',
middleware: 'auth',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      token: 'common/isToken'
    })
  },

  methods: {
    logout() {
        axios.post('/api/logout')
        .then( data => {
          console.log(data)
          if (data.data.status === 'success') {
            sessionStorage.clear()
            location.href = '/'
          }
        }).catch(error => {
          alert('error')
        })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

</style>
