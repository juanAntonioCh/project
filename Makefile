-include .env

arrancar:
	docker compose up -d
  
bajar:
	docker compose down
	docker volume rm volumen1
  
migrarbd:
	docker exec -it backend rm -r ConectaCar/migrations
	docker exec -it backend python3 manage.py makemigrations ConectaCar
	docker exec -it backend python3 manage.py migrate
	docker exec -it backend python3 /usr/src/app/import_marcas_modelos.py
