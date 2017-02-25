const React = require('react');
const ampersandReactMixin = require('ampersand-react-mixin');
const {fixed, compare} = require('../util');

module.exports = React.createClass({
  mixins: [ampersandReactMixin],
  getInitialState () {
    return {};
  },

  render () {
    let {competition} = this.props;
    let {competitors, events} = competition;

    let kinchTable = competitors.map(competitor => {
      let kinch = {
        name: competitor.name,
        medals: 0,
      };

      let total = 0;

      events.forEach(event => {
        let results = event.allResults(competitor.id);

        kinch[event.name] = results.map(result => result ? result.kinch : 0).reduce((a,b) => a + b) / results.length;
        total += kinch[event.name];

        let final = results[results.length - 1];
        if (final && final.placed) {
          kinch.medals++;
        }
      });

      kinch.total = total / events.length;

      return kinch;
    }).sort((a,b) => compare(a.total, b.total));

    return (
      <div className='container section is-fluid'>
        <table className='table'>
          <thead>
            <tr>
              <td>Pos</td>
              <td>Name</td>
              <td>Total</td>
              <td>Medals</td>
              {events.map((event, index) =>
                <td key={index}>{event.name}</td>
              )}
            </tr>
          </thead>
          <tbody>
            {kinchTable.map((competitor, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{competitor.name}</td>
                <td>{fixed(competitor.total)}</td>
                <td>{competitor.medals}</td>
                {events.map((event, index) =>
                  <td key={index}>{fixed(competitor[event.name])}</td>
                )}
              </tr>
            ))}
            </tbody>
        </table>
      </div>
    );
  },
});
