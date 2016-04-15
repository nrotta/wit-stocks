'use strict';

const YQL = require('yqlp');

exports.getPrice = function * (symbol) {
  const query = `SELECT Currency, Ask
                   FROM yahoo.finance.quotes
                  WHERE symbol IN ('${symbol}')`;

  try {
    const response = yield YQL.execp(query);
    const quote = response.query.results.quote;
    return `${quote.Currency} ${quote.Ask}`;
  } catch (err) {
    throw err;
  }
};
