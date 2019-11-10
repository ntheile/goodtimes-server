export function PlaceController (client, request) {
  client.room = this.setRoom(request);
  console.log(`New client connected to ${client.room}`);

  client.on('message', (message) => {
    const numberOfRecipients = this.broadcast(client, message);
    console.log(`${client.room} message broadcast to ${numberOfRecipients} recipient${numberOfRecipients === 1 ? '' : 's'}.`);
  });
};

