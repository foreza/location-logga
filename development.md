# Dev stuff

## What are folders in buckets?

Yeah, just add them to the filename in the path. YW

## Bucket needs CORS?

They didn't tell me that applying a CORS policy takes time.
I cried

```
gsutil cors set cors-config.json gs://location-logger-bucket
# check our work
gsutil cors get gs://location-logger-bucket
```


## Doing stuff locally and need to login?

https://cloud.google.com/docs/authentication/provide-credentials-adc

`gcloud auth application-default login`


## Making bucket public?

https://cloud.google.com/storage/docs/access-control/making-data-public

## Configuring an ENV file?

Create an .env file in the root. Populate the following values:

```
MAPS_API_KEY=<YOUR_MAPS_API_KEY>
DB_USER=<YOUR_PG_USER>
DB_PASSWORD=<YOUR_PG_USER_PW>
DB_NAME=<YOUR_PG_USER_NAME> 
DB_HOST_EXTERNAL=<YOUR_HOST_IP> 
```
Note that if you are invoking this function within gcloud, the DB host name 
should be something like this instead:

```
/cloudsql/blah:us-central1:blah
```




## Adding an public IP address for pSQL connection?

You'd do this for local development/testing.
Not needed if you plan on connecting to the DB within gcloud.

`curl ifconfig.me` (mac)

  **Make sure there is a public IP (already should be)**
  ```
  gcloud sql instances patch location-logger-db\
  --assign-ip 
  ```

  **Check the IP addresses** 

  ```
  gcloud sql instances describe location-logger-db | grep value
  ```

  **Update them (patch replaces!)**

  ```
  gcloud sql instances patch location-logger-db \
  --authorized-networks=172.118.173.36
  ```



## Function deploy from local (note the source tag)

https://github.com/foreza/location-logga
https://cloud.google.com/functions/docs/deploy#from-source-repo
https://cloud.google.com/functions/docs/configuring/env-var

```
 gcloud functions deploy location-logger-function-alpha \
--region=us-central1 \
--runtime=nodejs16 \
--source=. \
--entry-point=main \
--trigger-http \
--set-env-vars MAPS_API_KEY={API_KEY},DB_USER=postgres,DB_PASSWORD="{GETYOUROWNPW}",DB_NAME=dev-location-logger,DB_HOST={GETTHATYOURSELFFOOL}
```




## Setting this up

https://us-central1-pioneering-mode-209418.cloudfunctions.net/location-logger-reporter?startLoc=550forestparkblvdoxnard&endLoc=ucsbsanclemente
https://us-central1-pioneering-mode-209418.cloudfunctions.net/location-logger-reporter?endLoc=550forestparkblvdoxnard&startLoc=ucsbsanclemente