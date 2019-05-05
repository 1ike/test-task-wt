build:
	npm run build

b: build

c:
	npx webpack -d  --config-name client

d:
	npx webpack -d
	node dist/server

