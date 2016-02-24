'use strict';

var React = require('react');
var _ = require('lodash');

var CategorySubFilters = React.createClass ({
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getStateFromProps(nextProps));
    },
    getStateFromProps: function(props) {
        return {
            search: props.initialSearch,
            selectAll: this.state && this.state.selectAll || false
        }
    },
    getDefaultProps: function () {
        return {
            onClose: _.noop
        };
    },
    render: function () {
        if(this.props.cat != 'businessCategories') return null;
        var selectAllButton = this.state.selectAll ? 'Réinitialiser' : 'Tout sélectionner';
        return (
            <div className="new-filters subfilters">
                <div className="filter-header">
                    <div className="header-title">
                        Spécialités:
                    </div>
                </div>
                <button onClick={this.handleClose} className="btn btn-red previous">Précédent</button>
                {_.map(this.props.allCategories, function (filter) {
                    return (
                        <div key={filter.id} className="filter-line">
                            <label className="checkbox-inline">
                                <input type="checkbox"
                                    ref={filter.id}
                                    value={filter.slug}
                                    checked={this.isSearched(filter)}
                                    onChange={this.handleFilterChange} />
                                {filter.name}
                            </label>
                        </div>
                    )
                }, this)}
                <div className="filter-footer">
                    <button onClick={this.selectAll} className="btn btn-red semi">{selectAllButton}</button>
                    <button onClick={this.handleClose} className="btn btn-red semi">Valider</button>
                </div>
            </div>
        );
    },
    isSearched: function (filter) {
        return (_.indexOf(this.state.search.categories, filter.slug) > -1 ? true : false);
    },
    handleClose: function() {
        this.props.onClose(this.state.search);
        // this.setState({selectAll: false});
    },
    handleFilterChange: function (e) {
        var newTags = _.isArray(this.state.search.categories) ? this.state.search.categories : [];

        if (e.currentTarget.checked === true){
            newTags.push(e.currentTarget.value);
            this.setState({search: _.assign({}, this.state.search, {categories: newTags})});
        }
        else {
            this.setState({search: _.assign({}, this.state.search, {categories:  _.without(newTags, e.currentTarget.value)})});
        }
    },
    selectAll: function () {
        if (!this.state.selectAll){
            var newTags = _.map(this.props.allCategories, function(cat) { return cat.slug; });
            this.setState({search: {categories: newTags}, selectAll: !this.state.selectAll});

        } else {
            this.setState({search: {categories: {}}, selectAll: !this.state.selectAll});
        }
    }
});

module.exports = CategorySubFilters;
