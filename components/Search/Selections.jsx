'use strict';

var React = require('react');
var _ = require('lodash');

var Selections = React.createClass ({
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getStateFromProps(nextProps));
    },
    getStateFromProps: function(props) {
        return {
            search: props.initialSearch
        }
    },
    render: function() {
        // console.log('selections search', this.state.search);
        if(_.isEmpty(this.props.selections)) return null;
        return (
            <div className='selections'>
                <span className='title'>Nos sélections de coiffeurs</span>
                <hr className='underliner'/>
                {_.map(_.indexBy(this.props.selections, 'position'), function (selection) {
                    var active   = this.state.search && (this.state.search.selections || []).indexOf(selection.slug) > -1;
                    var onChange = active ? this.removeSelection.bind(this, selection.slug) : this.addSelection.bind(this, selection.slug);

                    return (
                        <label key={selection.label} className="checkbox-inline">
                            <input type="checkbox" align="baseline" 
                                onChange={this.props.handleSelectionChange.bind(null, selection.slug)} 
                                checked={active} />
                            <span />
                            {selection.label}
                        </label>
                    );
                }, this)}
            </div>
        );

    },
    handleClose: function() {
        this.props.onClose(this.state.search);
    },
    addSelection: function (selection) {
        this.setState({search: _.assign({}, this.state.search,{address: "Paris, France", selections: _.union(this.state.search.selections || [], [selection])})});
    },
    removeSelection: function (selection) {
        this.setState({search: _.assign({}, this.state.search,{selections: _.without(this.state.search.selections, selection)})});
    }

});

module.exports = Selections;
