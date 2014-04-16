require('sugar') // `Date.create('5pm')`
var today = require('../today')
var d3 = window.d3 = require('d3')

var list = d3.select("body").append("ul"),
    events = today(new Date(2014, 3, 17), false),
    pastEvents = today.earlier(events)
    eventHtml = require('../eventHtml')

var opacity = d3.scale.linear()
  .range([0, 1])
  .domain([events[events.length-1].dateFrom, new Date/1000])
  .clamp(true)

function update(events) {
  var events = list.selectAll("li")
      .data(events.reverse(), function(d) { return d.title + d.timeFrom + d.timeTo })

  events.attr("class", "update")

  events.enter().append("li")
      .attr("class", "enter")

  events
      .html(function(d) {
        return eventHtml(d, true)
      })
      .style("opacity", function(d) {
        return opacity(Date.create(d.timeFrom)/1000)
      })
      .classed("now", function(d) { return d.now })

  events.exit().remove()
}

update(events)
setInterval(function() {
  // update events to only include upcoming
  var pnf = today.pastNowFuture(events)
  pastEvents = pnf.past
  pnf.now.forEach(function(e) { e.now = true; console.log(e) })
  events = pnf.now.concat(pnf.future)
  update(events)
}, 1000)

window.events = events
window.pnf = today.pastNowFuture
window.opacity = opacity
