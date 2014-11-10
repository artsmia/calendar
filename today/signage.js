require('sugar') // `Date.create('5pm')`
var today = require('../today')
var d3 = window.d3 = require('d3')
var date = window.location.hash.match(/20\d\d/) ? new Date(window.location.hash) : new Date()

var list = d3.select("body").append("ul"),
    _today = today(date),
    events = _today(false),
    pastEvents = _today.earlier(events)
    eventHtml = require('../eventHtml'),
    bed = d3.select("body").append("div"),
    images = [
      {url: './patterns/grille-black.svg', id: 'one'}
    ]

list.attr("id", "pulse")
window.bed = bed
bed.attr("id", "bed")
var images = bed.selectAll("div")
    .data(images)
    .enter()
    .append('div')
    .attr("id", function(d) { return d.id })

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
    minutes = hhmm[1]
  d3.select('h1').html([hours%12, minutes].join(':'))
}
loop()

if(window.location.hash != '#all') {
  var updateLoop = setInterval(loop, 10000)
}

if((new Date).getDay() == 1) {
  d3.select("body").append("aside")
    .html("(We're closed)")
    .attr('id', 'closed')
}

