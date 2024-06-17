# ConectaCar

## Descripción

Esta es una aplicación web full-stack diseñada para la gestión de alquileres y reservas de vehículos entre particulares. El backend está implementado en Python utilizando Django Rest Framework, y el frontend en JavaScript utilizando React. La base de datos utilizada es MySQL.

## Despliegue Dockerizado en Local

Esta guía te ayudará a poner en funcionamiento tu aplicación web en tu máquina local utilizando Docker.


### Requisitos Previos

Antes de comenzar, asegúrate de tener las siguientes herramientas instaladas en tu máquina local:

- **Docker**: [Guía de instalación de Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Guía de instalación de Docker Compose](https://docs.docker.com/compose/install/)
- **Git**: [Guía de instalación de Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Clonar el Repositorio

Abre una terminal y clona el repositorio:

```bash
git clone https://github.com/juanAntonioCh/project.git
cd project
```

### Configuración de Variables de Entorno

Antes de ejecutar la aplicación, asegúrate de configurar las variables de entorno necesarias. Para ello, sigue estos pasos:

1. Copia el archivo `.env.example` y renómbralo a `.env`.
2. Abre el archivo `.env` y configura las siguientes variables de entorno:
   - `MYSQL_USER`: Nombre de usuario de MySQL.
   - `MYSQL_PASSWORD`: Contraseña de MySQL.
   - `MYSQL_ROOT_PASSWORD`: Contraseña de root de MySQL.
   - `MYSQL_DATABASE`: Nombre de la base de datos de MySQL.
   - `MYSQL_HOST`:  Nombre del host de MySQL. (db)


Dirígete al directorio reactapp y crea otro archivo .env para definir la ruta a la que vamos a hacer las peticiones:

```bash
cd reactapp
```

Copia la siguiente variable de entorno en el .env:
- `VITE_API_URL`=http://127.0.0.1:8001

### Construir y Ejecutar los Contenedores
Asegúrate de que Docker esté ejecutándose. Luego, construye y levanta los contenedores usando el Makefile:

```bash
make arrancar
```
Este comando construirá las imágenes de Docker y levantará los contenedores definidos en el archivo compose.yml.

## Realizar las Migraciones de la Base de Datos
Ejecuta las migraciones de la base de datos en el contenedor del backend:

```bash
make migrarbd
```

### Acceder a la Aplicación
Frontend: http://localhost:8080

Backend: http://localhost:8001

phpMyAdmin: http://localhost:8081

### Parar y Eliminar los Contenedores
Para detener y eliminar los contenedores, usa el siguiente comando:

```bash
make bajar
```


