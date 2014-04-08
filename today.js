var fs = require('fs')
var cal = JSON.parse(fs.readFileSync('calendar.json', 'utf8'))

module.exports = function eventsToday(date) {
  var date = date || new Date

  return cal.instances.filter(function(event) {
    var dateFrom = new Date(event.dateFrom*1000),
        dateTo = new Date(event.dateTo*1000),
        multiDay = dateFrom - dateTo != 0,
        // if this is a "1 day" event, dateTo and dateFrom will both be the beginning of the given day
        // so we need to check that dateTo is 'within 24 hours' of the requested datetime
        within24hours = date - dateTo <= 1000*60*60*24

    var isToday = dateFrom <= date && (multiDay && date <= dateTo || within24hours)
    return isToday
  })
}

