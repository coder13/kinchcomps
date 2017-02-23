const React = require('react');

module.exports = ({page}) => (
  <div className=''>
    <nav className='nav has-shadow'>
      <div className='nav-left'>
        <a className='nav-item'>KinchComps</a>
      </div>
    </nav>

    {page}
  </div>
);
