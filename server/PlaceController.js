import express from 'express';
import expressWS from 'express-ws';
import EventEmitter from 'wolfy87-eventemitter'; // emitter
import { Collection } from 'mongodb'; // db
import constants from '../lib/constants';
import { GenGroupKeyPutCentral, inviteMember } from './../utils/group';

// called from a client websocket
// https://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender
export async function PlaceController(io, socket, room, RadiksController) {

  console.log('new joiner ', room);


  // @todo write logic to see if the user can join the room based on location
  socket.join(room, async () => {
    //io.in(room).emit('message', `New client connected to ${room}`);
    console.log(`New client connected to ${room}`);
    await createRoomSession();

    async function createRoomSession() {
      // @todo check that the user is within the geo-fence via proof of presence
      let session = null;
      let placeId = room;

      return new Promise((resolve, reject) => {

        // https://flaviocopes.com/node-mongodb/
        let placeKey = `place_${placeId}`;
        RadiksController.centralCollection.find({ "_id": { $regex: placeKey } }).toArray(async (error, item) => {

          if (item.length > 0) {
            // grab session
            session = item;
          } else {
            // create room session
            // 1) create a new Group membership for the room that will last 1 day
            // createRadiksGroup
            session = await GenGroupKeyPutCentral(placeId, userToInvite);

          }

          socket.emit('message', session);


          // 2) Invite the requesting users public key to the room.
          inviteMemberIfNotExists(placeId, );
          // 3) send request back to user to accept 
          // client accepts like this

          resolve(session);
        });
      });
    }

    function inviteMemberIfNotExists(placeId, userToInvite) {
      // @todo
      // inviteMember(placeId, userToInvite);
    }


    // socket.on('message', (message) => {
      // const numberOfPeopleInRoom = this.broadcast(client, message);

      // io.in(room).emit('message', message);

      // switch (message.type){
      //   case "Get":{

      //   }
      //   case "Put":{

      //   }
      //   case "RequestKey": {
      //     if (numberOfRecipients > 0){
      //       // @todo proof of presense
      //       // (1) check if somebody is in the room, first by looking up the number of people in the room, then if somebody is in the room
      //       //      broadcasting out KeyRequest with the public key of the user", 
      //       //     the client who requested the key opens up a private websocket at /place/placeId/publicKey
      //       // (2) Wait 10 seconds for a response, 
      //             // if yes then send a "KeyRecieved" to /place/placeId/plublicKey
      //             // if no response, wait 10 more seconds
      //       // (3) if a key fails
      //     } else {
      //       // (1) lookup in central server by key place_placeId
      //              // if y then give client the key, make sure they acknowledge the key exchage then delete from the central server
      //              // make sure to pass back a code so a random person cannot delete the key
      //       // (2) if fails then send message for "KeyGenNew" to the client to generate a new key
      //     }
      //     break;
      //   } 
      //   case "StoreKey": {
      //     // if you are the last person in the room then you need to tell the server to store the key
      //     if (numberOfRecipients <=1 ){
      //         // save to central database with key of place_placeId
      //     }
      //     break;
      //   }
      //   case "DeleteKey": {
      //     // delete key from central server
      //     break;
      //   }
      //   case "PutAttendanceList": {
      //     let attendanceList = {
      //       placeId: "1234",
      //       bookie: "nicktee.id | pubKey",
      //       attendanceList: ["pubkey1", "pubKey2", "pubkey3"]

      //     }
      //     // put encrypted data
      //     break;
      //   }
      //   case "ApendToAttendanceList": {
      //     // query for attendance list for your user id
      //     // attendanceList.push("pubkey4")
      //     break;
      //   }
      //   default: {
      //     console.log('bad json message format. should look like this {"type": "RequestKey | Put | Get" } ')
      //   }
      // }
      // console.log(`${client.room} message broadcast to ${numberOfPeopleInRoom} recipient${numberOfPeopleInRoom === 1 ? '' : 's'}.`);


   // });


  });


};

