FROM python:3.12-slim

WORKDIR /app
COPY . /app

ENV COCHEMOTOR_PORT=8000
ENV COCHEMOTOR_DB_PATH=/data/cochemotor.db
EXPOSE 8000

VOLUME ["/data"]
CMD ["python", "local-broker/server.py"]
