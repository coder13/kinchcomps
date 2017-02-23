const React = require('react');
const Router = require('ampersand-router');
const {mount} = require('react-mounter');

const Layout = ({page}) => <div className='container is-fluid'>{page}</div>;

module.exports = Router.extend({
  routes: {
    '': 'home',
  },

  home () {
    mount(Layout, {
      page: <div>Hi</div>,
    });
  },
});