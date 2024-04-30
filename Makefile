-include .env

arrancar:
	docker compose up -d
  
bajar:
	docker compose down
  
migrarbd:
	sudo docker exec -it backend python3 manage.py makemigrations
	sudo docker exec -it backend python3 manage.py migrate
