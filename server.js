'use strict';

var Bcrypt = require('bcrypt'),
    Hapi = require('hapi'),
    Basic = require('hapi-auth-basic');

var server = new Hapi.Server();
server.connection({ port: 3000 });

var users = {
  user1: {
    username: 'user1',
    password: '$2a$10$jk7u12Irjh5KLv7neR.i7OEPMaQ2CKY/6NiaQISX4F/l5.KKbpnbq',   // abc123
    name: 'John Doe',
    id: '2145'
  },
  user2: {
    username: 'user2',
    password: '$2a$10$jk7u12Irjh5KLv7neR.i7O52ckNtYmHKzDcf4Vhojxfa371cfqgIS',   // cownow
    name: 'Jane Doe',
    id: '3865'
  }
};

var validate = function (username, password, callback) {
  var user = users[username];

  if (!user) {
    return callback(null, false);
  }

  Bcrypt.compare(password, user.password, function (error, isValid) {
    callback(error, isValid, {id: user.id, name: user.name});
  });
};

server.register(Basic, function (error) {

  if (error) {throw error;}

  server.auth.strategy('simple', 'basic', { validateFunc: validate });

  server.route({
    path: '/',
    method: 'GET',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        reply('hello, ' + request.auth.credentials.name);
      }
    }
  });

  server.start(function () {
    console.log('server running at: ' + server.info.uri);
  });
});

