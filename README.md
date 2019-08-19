# North Canterbury Metro Bus Service Query Library

[![Build Status](https://travis-ci.org/nevercast/node-metro-canterbury.svg?branch=master)](https://travis-ci.org/nevercast/node-metro-canterbury)


Query North Canterbury's Metro Bus Service Public API for timetables at a bus stop.

## Usage

```
const metro = require('metro-canterbury')

metro.platformEta(1 /* The platform tag, usually a bus-stop number. This may be an integer or string. It will be stringified. */ )
  .then(timetable => {
      /*
       * timetable is an array of arrival times
       * each entry in the array is an object with the properties:
       * { route: String, destination: String, eta: String }
       * 
       * You may wish to parse eta to an integer, this is not done for you.
       * route: The route name, usually a bus number, but expect ASCII characters too.
       * destination: Where the bus route terminates, some routes may terminate earlier than others, this is a string.
       * eta: Estimated time of arrival at the selected platform, in minutes.
       */
  })
  .catch(console.error) // Handle the error however you wish.

```

## Example

```
const metro = require('metro-canterbury')

metro.platformEta(1).then(timetable => timetable.forEach(
      entry => console.log(`Route: ${entry.route}, Destination: ${entry.destination}, Arrival time: ${entry.eta}m`)
  ),  err   => console.error(`Error occurred fetching the timetable: ${err}`))
```

## Note:

The data may appear sorted from earliest arrival to latest arrival. This sorting is provided by the server endpoint and is not handled by this library. Hence, it may change without notice. If you require the data to be sorted by time you may wish to sort it yourself.

## Fair Usage

The public facing website queries this API at most, every 30 seconds. Out of fair usage, please do not query the API more often than every 30 seconds. We want this service to remain public for the foreseeable future. Cheers.

## TODO

* Add browser bundle so it may be used client side in the browser [#1](https://github.com/nevercast/node-metro-canterbury/issues/1)
* Add CI/CD with Travis [#2](https://github.com/nevercast/node-metro-canterbury/issues/1)
* Add tests & coverage [#3](https://github.com/nevercast/node-metro-canterbury/issues/1)
* Add dependency watching & security auditing to the build process [#4](https://github.com/nevercast/node-metro-canterbury/issues/1)
