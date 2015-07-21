var nets = require('nets')

module.exports = function(callback) {
  nets({url: 'http://artsmia.github.io/calendar/calendar.json', encoding: 'utf8'}, function(err, resp, body) {
    var cal = JSON.parse(body)
      , sortedStart = cal.slice(0).sort(function(a, b) { return a.dateFrom - b.dateFrom })
      , sortedEnd = cal.slice(0).sort(function(a, b) { return a.dateTo - b.dateTo })

    cal.earliest = sortedStart[0]
    cal.latest = sortedEnd[sortedEnd.length-1]

    return callback(null, cal)
  })
}
