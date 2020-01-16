const userTemplates = [
    {
      name: 'Rick',
      lastName: 'Grimes',
      statusText: 'I am the leader!',
      image: 'users/rick.jpg'
    },
    {
      name: 'Daryl',
      lastName: 'Dixon',
      statusText: 'I like smashing Walkers.',
      image: 'users/daryl.jpg'
    },
    {
      name: 'Carol',
      lastName: 'Peletier',
      statusText: 'Don\'t mess with me!',
      image: 'users/carol.jpg'
    },
    {
      name: 'Negan',
      lastName: '',
      statusText: 'In a relationship with Lucille.',
      image: 'users/negan.jpeg'
    }
  ];

module.exports = function () {
  // mapping of all connected clients
  const clients = new Map()

  function addClient(client) {
    clients.set(client.id, { client })
  }

  function registerClient(client, user) {
    clients.set(client.id, { client, user })
  }

  function removeClient(client) {
    clients.delete(client.id)
  }

  function getAvailableUsers() {
    const usersTaken = new Set(
      Array.from(clients.values())
        .filter(c => c.user)
        .map(c => c.user.name)
    )
    return userTemplates
      .filter(u => !usersTaken.has(u.name))
  }

  function isUserAvailable(userName) {
    return getAvailableUsers().some(u => u.name === userName)
  }

  function getUserByName(userName) {
    return userTemplates.find(u => u.name === userName)
  }

  function getUserByClientId(clientId) {
    return (clients.get(clientId) || {}).user
  }

  return {
    addClient,
    registerClient,
    removeClient,
    getAvailableUsers,
    isUserAvailable,
    getUserByName,
    getUserByClientId
  }
}