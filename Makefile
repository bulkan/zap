test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter spec\
		--ui bdd\
		--recursive tests

.PHONY: test
