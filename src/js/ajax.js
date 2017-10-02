/* This module is made with the help of Johan Leitet's videos,
* "1DV022 - Demo - Ajax Autocomplete" (youtube),
* and '1DV022 - Demo - Autocomplete and Promises' (youtube),
* as they are in the Mandatory Resource form L07 - Ajax & Storage */

function request (config) {
  return Promise(function (resolve, reject) {
    config.method = config.method || 'GET'
    config.url = config.url || ''
    config.contentType = config.contentType || 'application/json'
    config.query = config.query || ''
    var req = new XMLHttpRequest()
    req.addEventListener('load', function () {
      if (req.status >= 400) {
        reject(new Error('Network Error' + req.status))
      }
      resolve(req.responseText)
    })
    req.open(config.method, config.url)
    req.setRequestHeader('Content-type', config.contentType)
    req.send(config.query)
  })
}

function post (config) {
  config.method = 'POST'
  return request(config)
}
function get (config) {
  config.method = 'GET'
  return request(config)
}

module.exports = {
  request: request,
  post: post,
  get: get
}
