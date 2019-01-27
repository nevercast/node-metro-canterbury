# North Canterbury Metro Bus Service Query Library

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