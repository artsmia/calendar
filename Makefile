default: calendar build

calendar:
	curl http://new.artsmia.org/visit/plan-your-trip/calendar-and-events/ | \
		grep calModel | \
		sed 's/var calModel = //' | \
		sed 's/;$$//' | \
		jq '.' > calendar.json

build:
	browserify -t brfs index.js -o bundle.js
	browserify -t brfs signage/signage.js -o signage/signage-bundle.js

by_date:
	@cat calendar.json | jq '.instances | group_by(.dateFrom) | map({length: .|length, event: map(.title+" -- "+.dateDisplay)})'

full-calendar:
	@git log -n100 --pretty=oneline --abbrev-commit calendar.json | cut -d ' ' -f1 | while read commit; do \
		git show $$commit:calendar.json | jq -c -r '.instances | .[]'; \
	done \
	| jq -s 'unique_by(.id, .dateFrom, .timeFrom) | sort_by("\(.dateFrom)-\(.timeFrom)-\(.title)-\(.id)")' > full-calendar.json
