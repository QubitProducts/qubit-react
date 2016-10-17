.PHONY: test sandbox

test:
	@echo 'No tests = no fail?'

sandbox:
	@(cd sandbox && make start)
