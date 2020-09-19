function authPerson(router, jwt, app) {

  router.post('/auth', (req, res) => {

    const obj = req.body
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    if ( obj.login === 'user' && obj.password === 'user' ) {
      const token = jwt.encode({iss:obj, exp: expires}, app.get('jwtTokenSecret'));
      req.session.user = {
        token: token
      }
      req.session.cookie.expires = expires
      res.json({status:'success',
                user: req.session.user})
    } else {
      ( obj.login !== 'user' ) ? res.json({
           status:'fail',
           data:'Login failed'
         }) :  res.json({
             status:'fail',
             data:'Password failed'
           })
    }

  })
}

module.exports = authPerson
