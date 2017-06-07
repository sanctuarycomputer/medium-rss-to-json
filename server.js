'use strict';

const Hapi   = require('hapi');
const Wreck  = require('wreck');
const Parser = require('xml2json');
const server = new Hapi.Server();

const defaultFeedName = 'sanctuary-computer-inc';
const xmlEndpoint = `https://medium.com/feed/${process.env.MEDIUM_FEED_NAME || defaultFeedName}`;

server.connection({
  port: (process.env.PORT || 4134),
  host: '0.0.0.0',
  routes: { cors: true }
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    Wreck.get(xmlEndpoint, (err, res, payload) => {
      if (err) return reply(`Error: ${err}`);
      return reply(Parser.toJson(payload, { object: true, sanitize: false }));
    });
  }
});

server.start((err) => {
  if (err) throw err;
  console.log(`~~~> Server running at: ${server.info.uri}`);
});
