The following command will bulk index the sample data into Elasticsearch. The data is indexed into the `search-movies` index.


curl -H 'Content-Type: application/x-ndjson' -XPOST '<elasticsearch-host>/_bulk?pretty' --data-binary "@bulk.json" --user elastic:password
