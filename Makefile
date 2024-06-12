-include .env

arrancar:
	docker compose up -d
  
bajar:
	docker compose down
  
migrarbd:
	docker exec -it backend rm -r ConectaCar/migrations
	docker exec -it backend python3 manage.py makemigrations ConectaCar
	docker exec -it backend python3 manage.py migrate
