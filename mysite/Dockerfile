FROM python:3.10.2

WORKDIR /usr/src/app

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1 

COPY requirements.txt .

RUN apt-get update && \
    apt install -y python3-dev default-libmysqlclient-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* 
    
COPY . .

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
    
EXPOSE 8000

ENTRYPOINT ["python", "manage.py", "runserver", "0.0.0.0:8000"]