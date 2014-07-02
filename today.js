require('sugar')
var cal = require('./events')

module.exports = function(date) {
  var date = date || new Date(),
      msPerDay = 60*24*60 * 1000,
      beginningOfDay = date - (date % msPerDay),
      relativeNow = 0

  var events = function (includeMultiday) {
    var includeMultiday = (typeof includeMultiday != 'undefined') ? includeMultiday : true

    return cal.filter(function(event) {
      var dateFrom = new Date(event.dateFrom*1000),
          dateTo = new Date(event.dateTo*1000),
          multiDay = dateFrom - dateTo != 0

      var isToday = dateFrom <= date && (multiDay && date <= dateTo || beginningOfDay <= dateTo)
      return includeMultiday ? isToday : !multiDay && isToday
    })
  }

  events.earlier = function(events) {
    var now = new Date
    return events.filter(function(e) { return Date.create(e.timeFrom) < now })
  }

  events.pastNowFuture = function(_events, pad, offset) {
    // TODO: refactor with Date.advance(millis)
    var now = new Date,
        pad = (pad || 15)*60*1000, // _ minutes in ms
        _events = _events || events(false)

    return {
      past: _events.filter(function(e) { return Date.create(e.timeFrom) < now - pad }),
      now: _events.filter(function(e) { var eventStart = Date.create(e.timeFrom); return now - pad < eventStart && eventStart < now - -pad }),
      future: _events.filter(function(e) { return now - -pad < Date.create(e.timeFrom) })
    }
  }

  return events
}
