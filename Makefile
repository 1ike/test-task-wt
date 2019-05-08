build:
	npm run build

b: build

lint:
	npm run lint

c:
	npx webpack -d  --config-name client

d:
	npx webpack -d
	node dist/server

