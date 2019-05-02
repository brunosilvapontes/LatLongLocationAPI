# LatLongLocationAPI

This REST API registers and returns data of locations. I've used MongoDB as the database of this project.

You need to have Node.js (> 8) installed and run 'npm install' on Terminal before using.

## To run the tests:
$ npm run test

## To run the application:
$ npm run start

## To run and develop (this will automatically restart the server when you update a file):
$ nodemon -L

## How to use:
This API has 3 endpoints:

### Request a POST on localhost:3000/location/<TYPE_A_LOCATION_NAME>
Use header 'content-type' with value 'application/json' on request header;

Send the body (JSON) of the request with the following fields: latitude (number), longitude (number) and additionalData (optional JSON object);

The data will be registered on MongoDB. If this location name already exists, the document will be updated. In both cases, create or update, the API will return a 201 HTTP code in case of success.

### Request a GET on localhost:3000/location/names
Use header 'apitoken' with value 'internal' on request header;

The API will return an array containing all registered location names.

### Request a GET on localhost:3000/location/<TYPE_A_LOCATION_NAME>
Use header 'apitoken' with value 'internal' on request header;

The API will return the location data and its distance to another fixed location in km. The distance is calculated using the Haversine formula (algorithm reference: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula). Latitude/longitude of the fixed location: 52.502931/13.408249.
