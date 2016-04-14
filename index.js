'use strict';

const co = require('co');
const Wit = require('node-wit').Wit;
const Stocks = require('./lib/stocks');

//TQQOBBTS4KDBLO2LZANDGORBVNTI3UGH
const token = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node index.js <wit-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

const actions = {
  say: (sessionId, msg, cb) => {
    console.log(msg);
    cb();
  },
  merge: (context, entities, cb) => {
    const symbol = entities.search_query && entities.search_query[0].value;
    if (symbol) {
      context.symbol = symbol;
    }

    cb(context);
  },
  error: (sessionId, msg) => {
    console.log('Oops, I n\'t know what to do.');
  },
  'fetch-price': (context, cb) => {
    co(function * () {
      context.price = yield Stocks.getPrice(context.symbol);
      cb(context);
    }).catch(err => {
      throw err;
    });
  }
};

const client = new Wit(token, actions);
client.interactive();
