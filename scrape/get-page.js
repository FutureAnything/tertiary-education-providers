var http = require('got')
var dom = require('cheerio').load

module.exports = get

function get (url, cb) {
  var opts = {
    timeout: 5000,
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    }
  }

  http.get(url, opts, function (err, body, res) {
    err ? cb(err) : cb(null, dom(body, {
      xmlMode: /xml/i.test(res.headers['content-type'])
    }))
  })
}
