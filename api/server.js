const express = require('express');

const ApiRouter = require('./api-router.js');

const server = express();

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const knexConnection = require('../data/dbConfig');

// configure express-session middleware
const sessionOptions = {
    name: 'fiftyfirstdates',
    secret: process.env.COOKIE_SECRET || 'keep it secret, keep it safe!', // for encryption
    cookie: {
      secure: process.env.COOKIE_SECURE || false, // in production should be true, false for development
      maxAge: 1000 * 60 * 60 * 24, // how long is the session good for, in milliseconds
      httpOnly: true, // client JS has no access to the cookie
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
      knex: knexConnection,
      createtable: true,
      clearInterval: 1000 * 60 * 60, // how long before we clear out expired sessions
    }),
  };

server.use(session(sessionOptions));
server.use(express.json());

server.use('/api', ApiRouter)

module.exports = server 