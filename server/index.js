const express = require('express');
const next = require('next');
const path = require('path');
const secure = require('express-force-https');
const cookiesMiddleware = require('universal-cookie-express');
require('dotenv').config();
const { setup } = require('radiks-server');
const { STREAM_CRAWL_EVENT } = require('radiks-server/app/lib/constants');
const makeApiController = require('./ApiController');
const PlaceInfoController = require('./PlaceInfoController.js');
const notifier = require('../common/lib/notifier');
const EventEmitter = require('wolfy87-eventemitter');
const dev = process.env.NODE_ENV !== 'production';
let app = next({ dev });
const emitter = new EventEmitter();
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT, 10) || 5000;
import { PlaceController } from './PlaceController';
import 'localstorage-polyfill';
const fetch = require('node-fetch');
const Window = require('window');
const window = new Window();
global.window = window; // for radiks to work
global.document = window.document; // for nextjs client side dom to work
import { createKeyChain, loadServerSession } from './Keychain';
// const { createServer } = require('http');
// const { parse } = require('url');

app.prepare().then(async () => {

  const server = express();
  server.use(cookiesMiddleware());
  server.use(secure);
  const RadiksController = await setup();
  server.use('/radiks', RadiksController);
 

  // custom websockets
  // let expressWs = require('@small-tech/express-ws')(server);
  // expressWs.RadiksController = RadiksController;
  // server.ws(`/place/:placeId`, PlaceController);  

  server.use((req, res, _next) => {
    if (dev) {
      return _next();
    }
    if (!!process.env.HEROKU_APP_NAME) {
      // this is a PR, continue
      return _next();
    }
    const isStaging = !!process.env.STAGING;
    if (!isStaging && req.hostname !== 'banter.pub') {
      console.log('Redirecting from non-production URL:', req.host);
      // return res.redirect('https://banter.pub');
    } else if (isStaging && req.hostname !== 'staging.banter.pub') {
      console.log('Redirecting from non-staging URL:', req.host);
      // return res.redirect('https://staging.banter.pub');
    }
    return _next();
  });

  server.get('/manifest.json', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.sendFile(path.join(__dirname, '..', 'static', 'manifest.json'));
  });

  server.use('/api', makeApiController(RadiksController.DB));
  server.use('/placeinfo', PlaceInfoController(RadiksController.DB));


  server.get('/messages/:id', (req, res) => {
    const { id } = req.params;
    app.render(req, res, '/message', { id });
  });

  server.get(`/[\\[::\\]]:username`, (req, res) => {
    const { username } = req.params;
    app.render(req, res, '/user', { username });
  });

  server.get('/session', (req, res) => {
    console.log('window.session', window.session);
    res.send('true');
  });

  server.get('*', (req, res) => handle(req, res));




  const serverInstance = server.listen(port, async (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });


  const io = require('socket.io')(serverInstance);
  io.on('connection', function (socket) {
    console.log('new connection');

    // join room
    socket.on('join', (room) => {
      PlaceController(io, socket, room, RadiksController)
    });

    // // broadcast room messages
    // socket.on('message', ({room, message })  => {
    //   console.log('message', message);
    //   io.in(room).emit('message', message);
    // });
  });

  RadiksController.emitter.on(STREAM_CRAWL_EVENT, ([attrs]) => {
    notifier(RadiksController.DB, attrs);
    if (attrs.geohash){
      let room = attrs.geohash;
      io.in(room).emit('message', attrs);
    }
  });

  let keychain = await createKeyChain(); // or get seed from .env
  window.session = await loadServerSession(keychain);
  console.log('keychain', keychain);
  console.log('window.session', window.session);

});




