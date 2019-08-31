# Goodtimes Server
This server implements Blockstack Radkis for group key management and real time web socket support.

## Development

To run the goodtimes server locally, first make sure you have MongoDB installed and running on your machine.

You can configure the database connection string by creating a `.env` in the root of the project file with the following contents:

~~~
MONGODB_URI=mongodb://localhost:27017/goodtimes
~~~

Then, install dependencies by running `yarn`. To run the app, run `yarn start`. The app will run on http://localhost:5000.

## Proxy to internet
https://ngrok.com/  Public URLs for sending previews to clients.
Spend more time programming. One command for an instant, secure URL to your localhost server through any NAT or firewall.