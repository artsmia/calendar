calendar:
	curl http://new.artsmia.org/visit/plan-your-trip/calendar-and-events/ | \
		grep calModel | \
		sed 's/var calModel = //' | \
		sed 's/;$$//' | \
		jq '.' > calendar.json
