var fs = require('fs')
var cal = JSON.parse(fs.readFileSync('calendar.json', 'utf8'))

var sortedStart = cal.instances.slice(0).sort(function(a, b) { return a.dateFrom - b.dateFrom })
  , sortedEnd = cal.instances.slice(0).sort(function(a, b) { return a.dateTo - b.dateTo })

cal.earliest = sortedStart[0]
cal.latest = sortedEnd[sortedEnd.length-1]

module.exports = cal

