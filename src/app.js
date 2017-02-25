const App = require('ampersand-app');
const Router = require('./router');
const api = window.Api = require('./api');
const Competitions = require('./models/competition-collection');

const app = window.app = App.extend({
  init () {
    app.comps = {
      upcoming: new Competitions(),
      in_progress: new Competitions(),
      past: new Competitions(),
    };

    this.getComps().then(() => {
      app.router = new Router();
      app.router.history.start();
    });
  },

  getComps () {
    return api.getComps().then(comps => {
      this.comps.in_progress.set(comps.in_progress);
      this.comps.past.set(comps.past);
    });
  },

  getComp (compId) {
    return this.comps.upcoming.get(compId) || this.comps.in_progress.get(compId) || this.comps.past.get(compId);
  },
});

app.init();
