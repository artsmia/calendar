var d3 = window.d3 = require('d3')
var date = window.location.hash.match(/20\d\d/) ? new Date(window.location.hash) : new Date()
var today = require('../today')

today(function(err, cal) {
  var events = cal.events
  var today = cal.today

  var list = d3.select("body").append("ul"),
      _today = today(events, date),
      events = _today(events, false),
      eventsToday = events,
      pastEvents = _today.earlier(events)
      eventHtml = require('../eventHtml')

  list.attr("id", "pulse")

  function update(events) {
    var events = list.selectAll("li")
        .data(events, function(d) { return d.title + d.timeFrom + d.timeTo })

    events.enter().append("li")

    events
        .html(function(d) {
          return eventHtml(d, true)
        })
        .classed("now", function(d) { return d.now })
        .classed("future", function(d) { return d.future })
        .classed("past", function(d) { return d.past })
        .classed("clearfix", true)
        .attr('class', function(d) {
          this.classList.add(d.typeCategory)
          this.classList.add(d.typeSlug)
          return this.classList.toString()
        })

    events.exit().remove()
  }
  update(events)

  function loop() {
    // update events to only include upcoming
    var pnf = _today.pastNowFuture()
    pnf.now.forEach(function(e) { e.now = true })
    pnf.future.forEach(function(e) { e.future = true })
    pnf.past.forEach(function(e) { e.past = true })

    var afterNow = pnf.now.concat(pnf.future)
    events = afterNow.length > 3 ? afterNow : pnf.past.last(3).concat(afterNow)
    list.classed('busy', function() { return events.length > 5 })
    update(events)
    if(window.location.hash == '#freeze') return clearInterval(updateLoop)

    var hhmm = (new Date).toTimeString().split(':').slice(0, 2),
      hours = hhmm[0],
      minutes = hhmm[1],
      ampm = 'am'
    if(hours > 11) ampm = 'pm'
    if(hours > 12) hours = hours%12
    d3.select('h1').html([hours, minutes].join(':')+' '+ampm)
  }
  loop()

  if(window.location.hash != '#all') {
    var updateLoop = setInterval(loop, 10000)
  }

  var dayOfWeek = date.getDay()
  if(dayOfWeek == 1) {
    d3.select("#hours")
      .html("Closed Mondays")
    d3.select("body").attr('id', 'closed')
  } else if(dayOfWeek == 6 || dayOfWeek == 0) {
    // restaurant is open Sat, Sun
    d3.select("#hours").html('Restaurant open today: 11am-2:30pm')
  } else {
    // restaurant is open Tues-Fri if Egypt is still on
    var currentExhibitions = eventsToday.filter(function(event) { return event.typeCategory == 'exhibitions' && event.prominence == 'large' })
    // TODO is there a better way to identify a current target exhibition?
    var targetExhibition = !!currentExhibitions.find(function(e) {
      return e.title === "Egypt's Sunken Cities"
    })
    // …the restaurant also chooses when they are/aren't open differently than this
    // was optimistically programmed for, so is there a better way to flip this switch
    // site-wide?

    if(targetExhibition) {
      d3.select("#hours").html('Restaurant open today: 11am-2:30pm')
    }
  }

  // Add tour meeting instructions when the given day has tours scheduled
  var hasMiaTours = !!events.find(function(e) { return e.typeName === "Daily Public Tour" })
  if(hasMiaTours) {
    d3.select('#tours').append('p').html(
      '<p>Mia Tours meet in the 2nd floor Rotunda.</p>'
    )
  }
  var hasPCHTours = !!events.find(function(e) { return e.title === "Purcell-Cutts House Tour" })
  if(hasPCHTours) {
    d3.select('#tours').append('p').html(
      '<p>For Purcell-Cutts House tours, board the shuttle 20 minutes prior at the 3rd Ave entrance.</p>'
    )
  }
})
