FROM python:3.9.13
WORKDIR /src
COPY . /src
RUN pip --no-cache-dir install -r requirements.txt
CMD ["python", "src/app.py"]
