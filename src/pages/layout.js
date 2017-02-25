const React = require('react');
const NavHelper = require('../components/nav-helper');

module.exports = ({page, competition}) => (
  <NavHelper>
    <div>
      <nav className='nav has-shadow'>
        <div className='nav-left'>
          <a className='nav-item' href='/'>KinchComps</a>
        </div>

        {competition ?
          <div className='nav-left'>
            <h3 className='nav-item is-3'>
              {competition.name}
            </h3>
          </div>
        : null}
      </nav>

      {page}
    </div>
  </NavHelper>
);
