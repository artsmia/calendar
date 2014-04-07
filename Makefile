default: calendar build

calendar:
	curl http://new.artsmia.org/visit/plan-your-trip/calendar-and-events/ | \
		grep calModel | \
		sed 's/var calModel = //' | \
		sed 's/;$$//' | \
		jq '.' > calendar.json

build:
	browserify -t brfs index.js -o bundle.js
