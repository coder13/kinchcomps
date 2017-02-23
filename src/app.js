require('./styles');

const App = require('ampersand-app');
const Router = require('./router');
const Competitions = require('./models/competition-collection');

const app = window.app = App.extend({
  init () {
    app.router = new Router();
    app.router.history.start();
  },
});

app.init();
