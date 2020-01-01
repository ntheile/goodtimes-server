const express = require('express');
const { decorateApp } = require('@awaitjs/express');


const PlaceInfoController = (db) => {
  
  const Router = decorateApp(express.Router());

  Router.getAsync('/headcount/:geohash', async (req, res) => {
    const { geohash } = req.params;

    var query = {_id: { $regex: geohash }};
    try{
      db.collection("radiks-central-data").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        try{
          const headcount = result[0].group.attrs.members.length;
          res.json({ count: headcount });
        } catch(e){
          res.json({ error: e });
        }
      });
    } catch(e){
      res.json({ error: e });
    }
  });


  return Router;
};

module.exports = PlaceInfoController;
