SHELL=/bin/bash

export HOST_UID=$(shell id -u)
export HOST_GID=$(shell id -g)

define down
	$(MAKE) down || $(MAKE) down
endef

define compose
	docker-compose $(1)
endef

define run
	$(call compose,run --service-ports --rm server $(1) && $(call down))
endef

.PHONY: down
down:
	$(call compose,down --remove-orphans)

.PHONY: up
up:
	$(call compose,up --build && $(call down))

.PHONY: shell
shell:
	$(call run,sh)

.PHONY: test
test:
	$(call run,npm test)

.PHONY: test-watch
test-watch:
	$(call run,npm run test:watch)

.PHONY: test-cov
test-cov:
	$(call run,npm run test:cov)

.PHONY: lint
lint:
	$(call run,npm run lint)

.PHONY: lint-fix
lint-fix:
	$(call run,npm run lint:fix)

.PHONY: build
build:
	$(call run,npm run build)

.PHONY: build-watch
build-watch:
	$(call run,npm run build:watch)

.PHONY: check-updates
check-updates:
	$(call run,npx --quiet --yes npm-check-updates)
