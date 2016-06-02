var d3 = window.d3 = require('d3')
var date = window.location.hash.match(/20\d\d/) ? new Date(window.location.hash) : new Date()
var today = require('../today')

today(function(err, cal) {
  var events = cal.events
  var today = cal.today

  var list = d3.select("body").append("ul"),
      _today = today(events, date),
      events = _today(events, false),
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
    d3.select('h1').html([hours, minutes].join(':')+ampm)
  }
  loop()

  if(window.location.hash != '#all') {
    var updateLoop = setInterval(loop, 10000)
  }

  // TODO test this in the new layout
  if((new Date).getDay() == 1) {
    d3.select("body").append("aside")
      .html("(We're closed)")
      .attr('id', 'closed')
  }

  var currentMajorExhibitions = events.filter(function(event) { event.typeCategory == 'exhibitions' && event.prominence == 'large' })
  if(currentMajorExhibitions.length == 0) {
    d3.select("#hours").html('Restaurant closed today. Café open museum hours.')
  }
})
