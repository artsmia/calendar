default: calendar build

calendar:
	curl http://new.artsmia.org/visit/calendar/ | \
		grep calModel | \
		sed 's/var calModel = //' | \
		sed 's/;$$//' | \
		jq '.instances' > calendar.json

	cat full-calendar.json calendar.json | \
		jq '.[]' | \
		jq -s 'unique_by(.id, .dateFrom, .timeFrom) | sort_by("\(.dateFrom)-\(.timeFrom)-\(.title)-\(.id)")' > new-full-calendar.json
	mv {new-,}full-calendar.json

	cat full-calendar.json calendar.json | \
		jq '.[]' | \
		jq -s -c 'unique_by(.id, .dateFrom, .timeFrom) | sort_by("\(.dateFrom)-\(.timeFrom)-\(.title)-\(.id)") | .[]' > full-line-delimited-calendar.json

build:
	browserify -t brfs graph/index.js -o graph/bundle.js
	browserify -t brfs today/signage.js -o today/signage-bundle.js

by_date:
	@cat calendar.json | jq 'group_by(.dateFrom) | map({date: .[0].dateDisplay | split(" at")[0], length: .|length, event: map(.title+" -- "+(.dateDisplay | split("at ") | reverse | .[0]))})'

commit:
	git add calendar.json full-calendar.json full-line-delimited-calendar.json graph/bundle.js today/signage-bundle.js
	git commit --author="miabot <null+github@artsmia.org>" -m "$$(date +%Y-%m-%d): $$(git diff --cached full-line-delimited-calendar.json | grep '^+' | wc -l | sed 's/ //g') changed"; \

refreshLobbyScreen:
	ssh today "sh ./restart-chromium.sh"
