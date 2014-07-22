var cal = require('../events')
var today = require('../today')
var d3 = require('d3')

window.d3 = d3

var w = window.innerWidth
  , h = window.innerHeight

var x = d3.scale.linear()
  .domain([cal.earliest.dateFrom, cal.latest.dateTo])
  .range([0, w])

var y = d3.scale.linear()
  .domain([0, cal.length])
  .range([0, h])

var typeColor = {
  "classes": "magenta",
  "family-events": "orange",
  "film-and-performance": "purple",
  "lectures-and-seminars": "blue",
  "special-events": "red",
  "tours": "green",
  "exhibitions": "chartreuse"
}

var eventHtml = require('../eventHtml.js')

var svg = d3.select("body").append("svg")
  .attr("width", w)
  .attr("class", "timeline")

var div = d3.select("body").append("div")
  .attr("class", "event")
  .style("opacity", 0);

var instances = svg.selectAll('.instance')
    .data(cal)
  .enter().append('rect')
    .attr("class", "instance")
    .attr("x", function(d) { return x(d.dateFrom) })
    .attr("y", function(d, i) { return y(i) })
    .attr("height", 5)
    .attr("width", function(d) { return Math.max(x(d.dateTo) - x(d.dateFrom), 5) })
    .attr('fill', function(d, i) { return typeColor[d.typeCategory] })
  .on('mouseover', function(d, i) {
    div.html(eventHtml(d))
    div.transition().duration(200).style("opacity", "0.9")
  })

window.api = {
  cal: cal,
  x: x,
  y: y,
  today: today
}
