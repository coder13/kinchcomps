const React = require('react');
const Router = require('ampersand-router');
const {mount} = require('react-mounter');
const LayoutPage = require('./pages/layout');
const HomePage = require('./pages/home');

// const Layout = ({page}) => <div className='container is-fluid'>{page}</div>;

module.exports = Router.extend({
  routes: {
    '': 'home',
  },

  home () {
    mount(LayoutPage, {
      page: <HomePage/>,
    });
  },
});
