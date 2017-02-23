const React = require('react');

module.exports = React.createClass({
  componentDidMount () {
    this.getComps();
  },

  getInitialState () {
    return {
      loading: true,
      in_progress: [],
      past: [],
      upcoming: [],
    };
  },

  getComps () {
    fetch('http://m.cubecomps.com/competitions.json').then(data => data.json()).then(comps => {
      this.state.loading = false;
      this.setState(comps);
    });
  },

  render () {
    const {loading, in_progress, upcoming} = this.state;

    if (loading) {
      return (
        <div className='container is-fluid'>Loading........</div>
      );
    }

    return (
      <div className='container section is-fluid'>
        <h3 className='title is-3'>Current:</h3>
        <ol>
          {in_progress.map(comp =>
            <li>{comp.name}</li>
          )}
        </ol>

        <h3 className='title is-3'>Upcoming: </h3>
        <ol>
          {upcoming.map((comp, index) =>
            <li key={index}><a href={`/competitions/${comp.id}`}>{comp.name}</a></li>
          )}
        </ol>
      </div>
    );
  },
});
