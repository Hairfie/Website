'use strict';

var React = require('react');
var DateTimeConstants = require('../../constants/DateTimeConstants');
var _ = require('lodash');

var OpeningDays = React.createClass ({
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getStateFromProps(nextProps));
    },
    getStateFromProps: function(props) {
        return {
            search: props.initialSearch,
            selectAll: false
        }
    },
    render: function() {
        if(this.props.cat != 'OpeningDays') return null;

        var displayDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        return (
            <div className="new-filters subfilters">
                <button onClick={this.handleClose} className="btn btn-red previous">Précédent</button>
                <div className="filter-header">
                    <div className="header-title">
                        Ouverture le:
                    </div>
                </div>
                {_.map(DateTimeConstants.weekDaysNumber, function(day) {
                    if (_.isEmpty(_.intersection([day], displayDays))) return null;
                    var active   = this.state.search && (this.state.search.days || []).indexOf(day) > -1;
                    var onChange = active ? this.removeDay.bind(this, day) : this.addDay.bind(this, day);
                    return (
                        <label key={DateTimeConstants.weekDayLabelFR(day)} className="checkbox-inline">
                            <input type="checkbox" align="baseline" onChange={onChange} checked={active} />
                            <span />
                            {DateTimeConstants.weekDayLabelFR(day)}
                        </label>
                        );
                    }, this)
                }
                <div className="filter-footer">
                    <button onClick={this.handleClose} className="btn btn-red full">Valider</button>
                </div>
            </div>
        );
    },
    handleClose: function() {
        this.props.onClose(this.state.search);
    },
    addDay: function (day) {
        this.setState({search: _.assign({}, this.state.search,{days: _.union(this.state.search.days || [], [day])})});
    },
    removeDay: function (day) {
        this.setState({search: _.assign({}, this.state.search,{days: _.without(this.state.search.days, day)})});
    }

});

module.exports = OpeningDays;
