# Goodtimes Server
This server implements Blockstack Radkis for group key management and real time web socket support.

## Development

To run the goodtimes server locally, first make sure you have MongoDB installed and running on your machine.

You can configure the database connection string by creating a `.env` in the root of the project file with the following contents:

~~~
MONGODB_URI=mongodb://localhost:27017/goodtimes
~~~

Then, install dependencies by running `yarn`. To run the app, run `yarn start`. The app will run on http://localhost:5000.


## Room Key

The concept of a `Room Key` is to enable strangers to be able to create a group encrytion key without requiring an assigned admin to create a member invitation. There's a gap in technology from one of the spectrum, public unencrypted data, and the other end, encrypted group data (invite only). The goal here is to allow people to enter a room then automatically grant them a group key to decrypt data for a certain period of time. The key should be rotated every day and it's up to the application to determine who should be let into the room (maybe based on a geo-fence...like in REAL LIFE!). There are many use-cases for this. Specifically in Goodtimes, it will be used to create ecrypted social walls for people in the same location or geo-fence. It depends on a number of technologies including, websockets, radiks central server and radiks group keys.


**Algorithm** 

Does the room have an unexpired group key yet? (keys expire every 24 hours)

- (n) then, you are the admin and create group key 
    - as people enter the room give them the admin key (just in case you leave), i.e gossip the key around
    - if everybody leaves the room then temporarily give the key to the central server (@todo think about what happens if the key gets lost)
    - then the next person to enter the room gets control of the admin key to gossip (the key is deleted from the central server)
    - (repeat until the key expires)
- (y) get the key from an admin (via web sockets) or from the central server (if empty place)

**Asumptions**
- The central server operator is trusted, since he will be the temporary holder of the key in the event of an empty room.
    - To mitigrate risks there should be several trusted server operators. NOT ONE CENTRAL GOD NODE. Maybe a handful of trusted operators per geographical region. For Example, Nick runs the Chicago node, Jude runs the New York Node, Alex runs the California node. 


