MAKEFLAGS += --no-builtin-rules
.PREFIXES:
.SUFFIXES:
.PHONY: test test-unit clean

test: test-unit
	@:

test-unit:
	@bash -i -c "NODE_ENV=test ./node_modules/.bin/mocha --bail"

clean:
	rm -Rf node_modules/
