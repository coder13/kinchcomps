const Collection = require('ampersand-collection');
const Competition = require('./competition');

module.exports = Collection.extend({
  model: Competition,
});
