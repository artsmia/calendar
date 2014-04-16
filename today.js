require('sugar')
var cal = require('./events')

module.exports = function (date, includeMultiday) {
  var date = date || new Date,
      includeMultiday = (typeof includeMultiday != 'undefined') ? includeMultiday : true

  return cal.instances.filter(function(event) {
    var dateFrom = new Date(event.dateFrom*1000),
        dateTo = new Date(event.dateTo*1000),
        multiDay = dateFrom - dateTo != 0,
        // if this is a "1 day" event, dateTo and dateFrom will both be the beginning of the given day
        // so we need to check that dateTo is 'within 24 hours' of the requested datetime
        msPerDay = 86400 * 1000,
        beginningOfDay = date - (date % msPerDay)

    var isToday = dateFrom <= date && (multiDay && date <= dateTo || beginningOfDay <= dateTo)
    return includeMultiday ? isToday : !multiDay && isToday
  })
}

module.exports.earlier = function(events) {
  var now = new Date
  return events.filter(function(e) { return Date.create(e.timeFrom) < now })
}

module.exports.pastNowFuture = function(events, pad) {
  var now = new Date,
      pad = (pad || 15)*60*1000 // _ minutes in ms

  return {
    past: events.filter(function(e) { return Date.create(e.timeFrom) < now - pad }),
    now: events.filter(function(e) { var eventStart = Date.create(e.timeFrom); return now - pad < eventStart && eventStart < now - -pad }),
    future: events.filter(function(e) { return now - -pad < Date.create(e.timeFrom) })
  }
}
