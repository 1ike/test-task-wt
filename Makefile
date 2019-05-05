build:
	npm run build

b: build

c:
	webpack -d  --config-name client

d:
	webpack -d
	node dist/server

