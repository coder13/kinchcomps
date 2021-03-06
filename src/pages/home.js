const React = require('react');
const ampersandReactMixin = require('ampersand-react-mixin');

const CompLi = ({id, name}) =>
  <li><a href={`/competitions/${id}`}>{name}</a></li>;

module.exports = React.createClass({
  mixins: [ampersandReactMixin],

  render () {
    const {in_progress, past} = this.props;

    let renderComps = (comp, index) =>
      <CompLi key={index} id={comp.id} name={comp.name}/>;

    return (
      <div className='container section is-fluid'>
        <h3 className='title is-3'>Current:</h3>
        <ul>
          {in_progress.map(renderComps)}
        </ul>

        <hr/>

        <h3 className='title is-3'>Past:</h3>
        <ul>
          {past.map(renderComps)}
        </ul>
        <a href='/past'>More Comps...</a>
      </div>
    );
  },
});
