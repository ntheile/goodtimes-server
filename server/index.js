const express = require('express');
const next = require('next');
const path = require('path');
const secure = require('express-force-https');
const cookiesMiddleware = require('universal-cookie-express');
require('dotenv').config();
const { setup } = require('radiks-server');
const { STREAM_CRAWL_EVENT } = require('radiks-server/app/lib/constants');
const makeApiController = require('./ApiController');
const notifier = require('../common/lib/notifier');
const EventEmitter = require('wolfy87-eventemitter');
const dev = process.env.NODE_ENV !== 'production';
let app = next({ dev });
const emitter = new EventEmitter();
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT, 10) || 5000;
import { PlaceController } from './PlaceController';
import 'localstorage-polyfill';
import { 
  configureRadiks,
  createBlockchainIdentity,
  initWallet, 
  makeUserSession, 
  makeProfileJSON, 
  saveProfileJSON  } from './../utils/profile';




app.prepare().then(async () => {
  
  const server = express();
  server.use(cookiesMiddleware());
  server.use(secure);
  
  const RadiksController = await setup();
  server.use('/radiks', RadiksController);
  
  //await createKeyChain();

  // custom websockets
  let expressWs = require('@small-tech/express-ws')(server);
  expressWs.RadiksController = RadiksController;
  server.ws(`/place/:placeId`, PlaceController);  

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
  
  server.get('/messages/:id', (req, res) => {
    const { id } = req.params;
    app.render(req, res, '/message', { id });
  });

  server.get(`/[\\[::\\]]:username`, (req, res) => {
    const { username } = req.params;
    app.render(req, res, '/user', { username });
  });

  server.get('*', (req, res) => handle(req, res));

  RadiksController.emitter.on(STREAM_CRAWL_EVENT, ([attrs]) => {
    notifier(RadiksController.DB, attrs);

    

  });
  

 

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });

});

async function createKeyChain(){
  let keychain = await initWallet();
  console.log('keychain',  keychain);
  let id = await createBlockchainIdentity(keychain);
  console.log('id',  id);
}