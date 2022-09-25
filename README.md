# location-logga


Planned v1 architecture:

- Cloud function 1 - fetch map data
  A) fetch API key from env
  B) calls the (google maps) API for a given location segment
  C) makes a connect to DB to INSERT the segment


- Cloud scheduler to call cloud function 1 on an interval
- PostGres DB to store data from cloud function
- Cloud function 2 - fetch reporting data through /GET for various segments 
  A) connect to DB to fetch data
  B) return all segments


  


