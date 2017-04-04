# Calendar-app

This app needs some custom data to display all the filters.

## How to initialize ES for this app

Run a Docker ES instance (or similar).

```docker run -p 9200:9200 -d elasticsearch:2.4.4```

Add the following CORS config to `/etc/elasticsearch/elasticsearch.yml` inside the container and restart the container

```
http.cors.enabled : true
http.cors.allow-origin : "*"
http.cors.allow-methods : OPTIONS, HEAD, GET, POST, PUT, DELETE
http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type,Content-Length
```

Delete existing index if needed:

```curl -XDELETE 'http://localhost:9200/events'```

Create mapping:

```curl -XPUT 'http://localhost:9200/events/' --data-binary @calendar-mappings.json```

Insert data:

```curl -XPOST 'http://localhost:9200/_bulk' --data-binary @calendar-data.ndjson```