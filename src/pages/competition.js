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

        let no = results.filter(i => !!i).length;
        if (no === 0) {
          kinch[event.name] = null;
          return;
        }

        let combined = results.map(result => result ? result.kinch : 0).reduce((a,b) => a + b);
        kinch[event.name] = combined ? combined / no : 0;
        total += kinch[event.name];

        let final = results[results.length - 1];
        if (final && final.placed) {
          kinch.medals++;
        }
      });

      kinch.total = total ? total / events.length : 0;

      return kinch;
    }).sort((a,b) => compare(a.total, b.total));

    return (
      <div className='container section is-fluid'>
        <table className='table is-narrow'>
          <thead>
            <tr>
              <td>Pos</td>
              <td>Name</td>
              <td>Total</td>
              <td>Medals</td>
              {events.map((event, index) =>
                <td key={index}>{event.shortName}</td>
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
                  <td key={index}>{competitor[event.name] === null ? ' ' : fixed(competitor[event.name])}</td>
                )}
              </tr>
            ))}
            </tbody>
        </table>
      </div>
    );
  },
});
