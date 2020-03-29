FROM ubuntu

WORKDIR /app

ENV url=

EXPOSE 5432

RUN apt-get update
RUN yes | apt-get install wget
RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
RUN chmod +x cloud_sql_proxy

CMD []