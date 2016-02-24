'use strict';

var React = require('react');
var _ = require('lodash');

var TagSubFilters = React.createClass ({
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
    getDefaultProps: function () {
        return {
            onClose: _.noop
        };
    },
    render: function () {
        if(_.isEmpty(this.props.cat)) return null;
        var selectAllButton = this.state.selectAll ? 'Réinitialiser' : 'Tout sélectionner';
        return (
            <div className="new-filters subfilters">
                <div className="filter-header">
                    <div className="header-title">
                        {'Catégorie :' + this.props.cat.name}
                    </div>
                </div>
                <button onClick={this.handleClose} className="btn btn-red previous">Précédent</button>
                {_.map(_.groupBy(this.props.allTags, 'category.id')[this.props.cat.id], function (filter) {
                    return (
                        <div key={filter.id} className="filter-category">
                            <label className="checkbox-inline">
                                <input type="checkbox"
                                    ref={filter.id}
                                    value={filter.name}
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
        return (_.indexOf(this.state.search.tags, filter.name) > -1 ? true : false);
    },
    handleClose: function() {
        this.props.onClose(this.state.search);
        this.setState({selectAll: false});
    },
    handleFilterChange: function (e) {
        var newTags = _.isArray(this.state.search.tags) ? this.state.search.tags : [];

        if (e.currentTarget.checked === true){
            newTags.push(e.currentTarget.value);
            this.setState({search: _.assign({}, this.state.search, {tags: newTags})});
        }
        else {
            this.setState({search: _.assign({}, this.state.search, {tags:  _.without(newTags, e.currentTarget.value)})});
        }
    },
    selectAll: function () {
        var allCategoryTags = _.groupBy(this.props.allTags, 'category.id')[this.props.cat.id];
        if (!this.state.selectAll){
            var newTags = _.map(allCategoryTags, 'name');
            if(_.isArray(this.state.search.tags)) newTags = newTags.concat(this.state.search.tags)
            this.setState({search: {tags: _.uniq(newTags)}});
        } else {
            var currentTags = _.map(allCategoryTags, 'name');
            var newTags = _.filter(this.state.search.tags, function(tag) {
                return !_.include(currentTags, tag)
            });
            this.setState({search: {tags: newTags}});
        }
        this.setState({selectAll: !this.state.selectAll});
    }
});

module.exports = TagSubFilters;
