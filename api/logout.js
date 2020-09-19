function logout(router) {
  router.post('/logout', (req, res) => {
    req.session.destroy( () => {
      res.json({status:'success'})
    })
  })
}
module.exports = logout
