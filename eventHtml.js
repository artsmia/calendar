module.exports = function(d, excludeDate) {
  var excludeDate = (typeof excludeDate == 'undefined') ? false : excludeDate

  var dateFrom = new Date(d.dateFrom*1000)
    , dateTo = new Date(d.dateTo*1000)
    , dates = (d.dateFrom === d.dateTo ? [dateFrom] : [dateFrom, dateTo])
    , dateString = dates.map(function(date) {
      return date.toLocaleString().split(" ")[0]
    }).join(" — ")

  return "<h3><a href='"+d.permalink+"'>"+d.title+"</a></h3>" +
    "<p>"+d.typeName+". "+d.timeFrom+" "+(excludeDate ? '' : dateString)+"</p>"
}
