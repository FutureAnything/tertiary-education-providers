#!/usr/bin/env node

var parse = require('url').parse
var get = require('./get-page')

var PROVIDERS = 'http://www.teqsa.gov.au/national-register/search/provider?page={ndx}'

providers(function (err, list) {
  if (err) return console.error(err)
  console.log(JSON.stringify(list.sort()))
})

function providers (cb) {
  var list = []
  var start = 0
  var end

  scrape(start)

  function scrape (ndx) {
    console.error('# Scraping page ' + (ndx + 1))

    var url = PROVIDERS.replace('{ndx}', ndx)
    get(url, function (err, $) {
      if (err) return cb(err)

      var view = $('.view-provider-search')

      // Grab the names of the providers
      view.find('tbody .views-field-field-trading-name')
        .each(function () {
          $(this).text().trim()
            .split(/\s*,\s*/)
            .forEach(function (name) { 
              if (name && !~list.indexOf(name)) {
                list.push(name)
                console.error(name)
              } 
            })
        })

      // Find the last search page index
      if (end === void 0) {
        var href = view.find('.pager-last a').attr('href')
        var lndx = parse(href, true).query.page
        if (!lndx) return cb(new Error('No last page found'))
        end = +lndx
      }

      ndx < end ? scrape(++ndx) : cb(null, list)
    })
  }
}
