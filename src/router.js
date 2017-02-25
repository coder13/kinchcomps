const React = require('react');
const Router = require('ampersand-router');
const {mount} = require('react-mounter');
const LayoutPage = require('./pages/layout');
const HomePage = require('./pages/home');
const CompetitionPage = require('./pages/competition');
const PastPage = require('./pages/past');
const Competition = require('./models/competition');

module.exports = Router.extend({
  routes: {
    '': 'home',
    'past': 'past',
    'competitions/:id': 'competition',
  },

  home () {
    mount(LayoutPage, {
      page: <HomePage in_progress={app.comps.in_progress} past={app.comps.past}/>,
    });

    app.getComps();
  },

  past () {
    app.comps.past.reset();

    mount(LayoutPage, {
      page: <PastPage past={app.comps.past}/>,
    });

    Api.getPastComps().then(comps => {
      app.comps.past.set(comps.past);
    });
  },

  competition (id) {
    let comp = app.getComp(id);
    if (!comp) {
      comp = new Competition({id});
    }

    comp.fetch();

    mount(LayoutPage, {
      page: <CompetitionPage competition={comp}/>,
      competition: comp,
    });
  },
});
