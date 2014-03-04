var fs = require('fs')
var cal = JSON.parse(fs.readFileSync('calendar.json', 'utf8'))
var d3 = require('d3')

window.d3 = d3

var w = window.innerWidth
  , h = window.innerHeight

var x = d3.scale.linear()
  .domain([cal.minDate, cal.maxDate])
  .range([0, w-100])

var y = d3.scale.linear()
  .domain([0, cal.instances.length])
  .range([0, h])

var svg = d3.select("body").append("svg")
  .attr("width", w)
  .attr("class", "timeline")

var instances = svg.selectAll('.instance')
    .data(cal.instances)
  .enter().append('rect')
    .attr("class", "instance")
    .attr("x", function(d) { return x(d.dateFrom) })
    .attr("y", function(d, i) { return y(i) })
    .attr("height", 5)
    .attr("width", function(d) { return Math.max(x(d.dateTo) - x(d.dateFrom), 5) })

window.api = {
  cal: cal,
  x: x,
  y: y,
}
