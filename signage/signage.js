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

list.attr("id", "pulse")

function update(events) {
  var events = list.selectAll("li")
      .data(events.reverse(), function(d) { return d.title + d.timeFrom + d.timeTo })

  events.enter().append("li")

  events
      .html(function(d) {
        return eventHtml(d, true)
      })
      .style("opacity", function(d) {
        return opacity(Date.create(d.timeFrom)/1000)
      })
      .classed("now", function(d) { return d.now })
      .classed("clearfix", true)
      .attr('class', function(d) {
        this.classList.add(d.typeCategory)
        return this.classList.toString()
      })

  events.exit().remove()
}

update(events)
if(window.location.hash != '#all') {
  setInterval(function() {
    // update events to only include upcoming
    var pnf = today.pastNowFuture(events)
    pastEvents = pnf.past
    pnf.now.forEach(function(e) { e.now = true })
    events = pnf.now.concat(pnf.future)
    // if(events.length == 0) events = pastEvents
    update(events)
  }, 1000)
}
