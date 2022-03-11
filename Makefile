SHELL=/bin/bash
UID=`id -u`
GID=`id -g`
DOWN=$(MAKE) down || $(MAKE) down

.PHONY: down
down:
	docker-compose down --remove-orphans

.PHONY: up
up:
	UID=$(UID) GID=$(GID) docker-compose up --build && $(DOWN)

.PHONY: shell
shell:
	UID=$(UID) GID=$(GID) docker-compose run --service-ports --rm server sh && $(DOWN)

.PHONY: test
test:
	UID=$(UID) GID=$(GID) docker-compose run --service-ports --rm server npm run test && $(DOWN)

.PHONY: test-watch
test-watch:
	UID=$(UID) GID=$(GID) docker-compose run --service-ports --rm server npm run test:watch && $(DOWN)

.PHONY: test-cov
test-cov:
	UID=$(UID) GID=$(GID) docker-compose run --service-ports --rm server npm run test:cov && $(DOWN)

.PHONY: lint
lint:
	UID=$(UID) GID=$(GID) docker-compose run --service-ports --rm server npm run lint && $(DOWN)

.PHONY: lint-fix
lint-fix:
	UID=$(UID) GID=$(GID) docker-compose run --service-ports --rm server npm run lint:fix && $(DOWN)

.PHONY: build
build:
	UID=$(UID) GID=$(GID) docker-compose run --service-ports --rm server npm run build && $(DOWN)

.PHONY: build-watch
build-watch:
	UID=$(UID) GID=$(GID) docker-compose run --service-ports --rm server npm run build:watch && $(DOWN)

.PHONY: check-updates
check-updates:
	UID=$(UID) GID=$(GID) docker-compose run --service-ports --rm server npx --quiet --yes npm-check-updates && $(DOWN)
