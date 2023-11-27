FROM  python:3.11-bullseye

ENV PYTHONUNBUFFERED=1

WORKDIR /EcoTiDAi-Backend

# copy from the current directory of the Dockerfile to /api in the image
COPY . . 

# Install core dependencies.
RUN apt-get update && apt-get install -y libpq-dev build-essential

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000