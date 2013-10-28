test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter spec\
		--ui bdd\
		--recursive tests

.PHONY: test
