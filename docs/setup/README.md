# If your using elastic locally
If you are are getting a cors related error, you will need to add the following to you
`config/elasticsearch.yml' file
```yaml
http.cors.enabled : true  
http.cors.allow-origin : "*"
http.cors.allow-methods : OPTIONS, HEAD, GET, POST, PUT, DELETE
http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length
```
