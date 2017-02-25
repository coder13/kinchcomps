const React = require('react');
const ampersandReactMixin = require('ampersand-react-mixin');

const CompLi = ({id, name}) =>
  <li><a href={`/competitions/${id}`}>{name}</a></li>;

module.exports = React.createClass({
  mixins: [ampersandReactMixin],

  render () {
    const {past} = this.props;

    let renderComps = (comp, index) =>
      <CompLi key={index} id={comp.id} name={comp.name}/>;

    return (
      <div className='container section is-fluid'>
        <ul>
          {past.map(renderComps)}
        </ul>
      </div>
    );
  },
});
