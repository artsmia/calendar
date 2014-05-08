require('sugar') // `Date.create('5pm')`
var today = require('../today')
var d3 = window.d3 = require('d3')

var list = d3.select("body").append("ul"),
    events = today(new Date, false),
    pastEvents = today.earlier(events)
    eventHtml = require('../eventHtml')

var opacity = d3.scale.linear()
  .range([0, 1])
  .domain([events[events.length-1].dateFrom, new Date/1000])
  .clamp(true)

list.attr("id", "pulse")

function update(events) {
  var events = list.selectAll("li")
      .data(events, function(d) { return d.title + d.timeFrom + d.timeTo })

  events.enter().append("li")

  events
      .html(function(d) {
        return eventHtml(d, true)
      })
      .style("opacity", function(d) {
        // TODO: should this happen in css based on classes {past, now, future}?
        return Date.create(d.timeFrom).advance(15*60*1000) > new Date ? 1 : 0.5
      })
      .classed("now", function(d) { return d.now })
      .classed("future", function(d) { return d.future })
      .classed("past", function(d) { return d.past })
      .classed("clearfix", true)
      .attr('class', function(d) {
        this.classList.add(d.typeCategory)
        return this.classList.toString()
      })

  events.exit().remove()
}

update(events)
if(window.location.hash != '#all') {
  var updateLoop = setInterval(function() {
    // update events to only include upcoming
    var pnf = today.pastNowFuture(events)
    pnf.now.forEach(function(e) { e.now = true })
    pnf.future.forEach(function(e) { e.future = true })
    pnf.past.forEach(function(e) { e.past = true })

    events = pnf.past.last(3).concat(pnf.now).concat(pnf.future)
    update(events)
    if(window.location.hash != 'freeze') return clearInterval(updateLoop)
  }, 1000)
}
