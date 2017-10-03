function request (config, callback) {
  config.method = config.method || 'GET'
  config.url = config.url || ''
  config.contentType = config.contentType || 'application/json'
  config.query = config.query || ''
  var req = new XMLHttpRequest()
  req.addEventListener('load', function () {
    if (req.status >= 400) {
      callback(req.status)
    }
    callback(null, req.responseText)
  })
  req.open(config.method, config.url)
  req.setRequestHeader('Content-type', config.contentType)
  req.send(config.query)
}
/*
function post (config) {
  config.method = 'POST'
  request(config, function (error, data) {
    if (error) {
      throw new Error('Network' + error)
    }
    data = JSON.parse(data)
    console.log('hey from here ' + data)
    return data
  })
}
function get (config) {
  config.method = 'GET'
  request(config, function (error, data) {
    if (error) {
      throw new Error('Network' + error)
    }
    data = JSON.parse(data)
    console.log('hey from here ' + data.message)
    return data
  })
}
*/
module.exports = {
  request: request
 // post: post,
 // get: get
}
