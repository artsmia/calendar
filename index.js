var fs = require('fs')
var cal = JSON.parse(fs.readFileSync('calendar.json', 'utf8'))
var d3 = require('d3')

var sortedStart = cal.instances.slice(0).sort(function(a, b) { return a.dateFrom - b.dateFrom })
  , sortedEnd = cal.instances.slice(0).sort(function(a, b) { return a.dateTo - b.dateTo })

cal.earliest = sortedStart[0]
cal.latest = sortedEnd[sortedEnd.length-1]

window.d3 = d3

var w = window.innerWidth
  , h = window.innerHeight

var x = d3.scale.linear()
  .domain([cal.earliest.dateFrom, cal.latest.dateTo])
  .range([0, w])

var y = d3.scale.linear()
  .domain([0, cal.instances.length])
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

var eventHtml = function(d) {
  var dateFrom = new Date(d.dateFrom*1000)
    , dateTo = new Date(d.dateTo*1000)
    , dates = (d.dateFrom === d.dateTo ? [dateFrom] : [dateFrom, dateTo])
    , dateString = dates.map(function(date) {
      return date.toLocaleString().split(" ")[0]
    }).join(" — ")

  return "<h3><a href='"+d.permalink+"'>"+d.title+"</a></h3>" +
    "<p>"+d.typeName+". "+dateString+"</p>"
}

var svg = d3.select("body").append("svg")
  .attr("width", w)
  .attr("class", "timeline")

var div = d3.select("body").append("div")
  .attr("class", "event")
  .style("opacity", 0);

var instances = svg.selectAll('.instance')
    .data(cal.instances)
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
}
