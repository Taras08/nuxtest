import axios from 'axios'

export default {
  async auth({ commit }, { login, password }) {
    try {
      const { data } = await axios.post('/api/auth', { login, password  })
      if (data.status === 'success') commit('SET_TOKEN', data.user.token)
      return data
    } catch (error) {
      Error(error)
    }
  },
}
