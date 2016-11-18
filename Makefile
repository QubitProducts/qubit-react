.PHONY: booststrap lint test test-watch sandbox

BIN = ./node_modules/.bin

bootstrap:
	yarn

lint:
	$(BIN)/standard
	$(BIN)/standard5

test: lint
	$(BIN)/jest

test-watch: lint
	$(BIN)/jest --watchAll

sandbox:
	@(cd sandbox && make start)
