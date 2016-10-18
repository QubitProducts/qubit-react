.PHONY: booststrap test sandbox

bootstrap:
	npm i

test:
	@echo 'No tests = no fail?'

sandbox:
	@(cd sandbox && make start)
