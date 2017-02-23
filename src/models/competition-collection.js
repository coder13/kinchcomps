const Collection = require('ampersand-rest-collection');
const Competition = require('./competiton');

module.exports = Collection.extend({
  model: Competition,

  url: 'http://m.cubecomps.com/competitions.json',
});
