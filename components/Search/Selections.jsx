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
        if(_.isEmpty(this.props.selections)) return null;

        if(this.props.cat != 'selections') return (
            <div>
                {this.props.children}
            </div>
        );

        return (
            <div className="new-filters subfilters">
                <button onClick={this.handleClose} className="btn btn-red previous">Précédent</button>
                <div className="filter-header">
                    <div className="header-title">
                        Nos sélections de coiffeurs
                    </div>
                </div>
                {_.map(_.indexBy(this.props.selections, 'position'), function (selection) {
                        var active   = this.state.search && (this.state.search.selections || []).indexOf(selection.slug) > -1;
                        var onChange = active ? this.removeSelection.bind(this, selection.slug) : this.addSelection.bind(this, selection.slug);

                        return (
                            <label key={selection.label} className="checkbox-inline">
                                <input type="checkbox" align="baseline" 
                                    onChange={onChange} 
                                    checked={active} />
                                <span />
                                {selection.label}
                            </label>
                        );
                    }, this)}
                <div className="filter-footer">
                    <button onClick={this.handleClose} className="btn btn-red full">Valider</button>
                </div>
            </div>
        );
    },
    handleClose: function() {
        this.props.onClose(this.state.search);
    },
    addSelection: function (selection) {
        this.setState({search: _.assign({}, this.state.search,{selections: _.union(this.state.search.selections || [], [selection])})});
    },
    removeSelection: function (selection) {
        this.setState({search: _.assign({}, this.state.search,{selections: _.without(this.state.search.selections, selection)})});
    }

});

module.exports = Selections;
