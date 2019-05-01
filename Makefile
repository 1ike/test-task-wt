build:
	npm run build

b: build

server:
	npm run server -- --open 'C:\Program Files\Firefox Developer Edition\Firefox.exe'

s: server

c:
	webpack -d  --config-name client

d:
	webpack
	node dist/server

