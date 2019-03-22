build:
	npm run build

b: build

server:
	npm run server -- --open 'C:\Program Files\Firefox Developer Edition\Firefox.exe'

s: server

d:
	webpack
	node dist/

