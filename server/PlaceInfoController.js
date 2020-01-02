const express = require('express');
const { decorateApp } = require('@awaitjs/express');
import Geohash from 'latlon-geohash';

const minPeopleCount = 5;

const PlaceInfoController = (db) => {
  
  const Router = decorateApp(express.Router());

  Router.getAsync('/headcount/:lat/:long', async (req, res) => {
    const { lat, long } = req.params;

    // get all 8 hashes
    let precision = 9;
    const geohash9 = Geohash.encode(lat, long, precision);
    const geohash8 = Geohash.encode(lat, long, 8);
    const geohash = Geohash.encode(lat, long, 2);
    
    console.log('geohash9', geohash9);
    var query = {_id: { $regex: geohash9 }};

    try{
      let headcount = await geohashQuery(query);
      res.json({ count: headcount });
    } catch(e){
     res.json({ error: e });
    }
      

  });

  async function geohashQuery(query){
    let cursor = db.collection("radiks-central-data").find(query);
    let result = await cursor.toArray();
    console.log('result of query', result);
    try{
       const headcount = result[0].group.attrs.members.length;
       return headcount;
    } catch(e){
      return 0;
    }
    
  }

  return Router;
};



module.exports = PlaceInfoController;
