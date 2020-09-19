export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  async nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.user) {
      const { token, type } = req.session.user
      commit('common/SET_TOKEN', token)
    }
  },
}
