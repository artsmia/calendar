var today = require('./today')
var d3 = require('d3')

var events = today(new Date(2014, 3, 17), false),
    eventHtml = require('./eventHtml')

window.d3 = d3

var list = d3.select("body").append("ul")

var events = list.selectAll(".event")
    .data(events)
  .enter().append("li")
    .html(function(d) {
      return eventHtml(d, true)
    })
