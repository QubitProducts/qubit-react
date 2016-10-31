.PHONY: booststrap test test-watch sandbox

BIN = ./node_modules/.bin

bootstrap:
	yarn

test:
	$(BIN)/jest

test-watch:
	$(BIN)/jest --watchAll

sandbox:
	@(cd sandbox && make start)
