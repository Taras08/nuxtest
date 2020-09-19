const url = require('url')
const http = require('http')
const Promise = require('Promise')
const HTTP_REQUEST_PARAMETER_ADDRESS = 'address'
//const HTTP_CONTENT_TYPE_BASE64 = 'X-user/base64-data'

function getContentType(urlValue) {
  try {
    var uri = url.parse(urlValue)

    switch(uri.path) {
      case '/services/cmp':
      case '/public/x509/cmp':
        return ''

      case '/services/ocsp':
      case '/public/ocsp':
        return 'application/ocsp-request'

      case '/services/tsp':
      case '/public/tsa':
        return 'application/timestamp-query'

      default:
        return ''
    }
  } catch(e) {
    return ''
  }
}

function handleRequest(method, path, data,
                       resolve, reject) {
  try {
    if(method != 'POST' && method != 'GET') {
      reject(400)
      return
    }
    if(method == 'POST') {
      data = Buffer.from(data + '', 'base64')
      if(!data) {
        reject(400)
        return
      }
    }

    var pathURL = url.parse(path, true)
    var address = pathURL.query[HTTP_REQUEST_PARAMETER_ADDRESS]
    if(!address || address == '') {
      reject(400)
      return
    }

    if(address.indexOf('://') == -1){
      address = 'http://' + address
    }

    var addressURL = url.parse(address, false)
    var hostname = addressURL.hostname
    path = addressURL.path
    var port = addressURL.port

    var options = {
      hostname: hostname,
      port: port,
      path: path,
      method: method,
      headers: {},
    }

    if(method == 'POST') {
      options.headers['Content-Type'] = getContentType(address)
      options.headers['Content-Length'] = data.length
    }

    var request = http.request(options, (response) => {
      var data = []
      response.on('data', (chunk) => {
        data.push(chunk)
      })

      response.on('end', () => {
        data = Buffer.concat(data)
        data = (new Buffer(data)).toString('base64')
        resolve(data)
      })
    })

    request.on('error', (e) => {
      console.error(e)
      reject(500)
    })

    if(method == 'POST') {
      data = Buffer.from(data, 'base64')
      request.write(data)
      request.end()
    }
  } catch(e) {
    console.error(e)
    reject(500)
  }
}

const requestHandler = function(request, response) {
  console.log(request.url)
  request.addListener('data', function(data) {
    (new Promise(function(resolve, reject) {
      handleRequest(request.method, request.url,
        data, resolve, reject)
      console.log('request.url', request.url)
    })).then(function(data) {
      response.writeHead(200,
        {
          'Content-Type': 'X-user/base64-data; charset=utf-8',
        },
      )
      response.end(data)
    }).catch(function(status) {
      response.writeHead(status)
      response.end()
    })
  })
}

const port = 80
const server = http.createServer(requestHandler)
server.listen(port, (request, response, err) => {
  if(err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})
