const promise = require('bluebird');

const options = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = 'postgres://dbusername:passwrod@server:port/database';
const db = pgp(connectionString);

module.exports = db;
