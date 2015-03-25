'use strict';

var React = require('react');
var GeoInput = require('../Form/PlaceAutocompleteInput.jsx');
var SubmitSearch = require('../../actions/Business').SubmitSearch;

module.exports = React.createClass({
    propTypes: {
        context: React.PropTypes.object.isRequired
    },
    render: function () {
        return (
            <div className="searchbar small-search col-sm-12">
                <GeoInput ref="address" placeholder="Où ?" className="col-sm-3" />
                <input ref="query" type="search" name="s" placeholder="Catégorie, spécialité..." className="col-sm-3" />
                <input ref="date" type="date" className="col-sm-3" />
                <button type="button" className="btn btn-red" onClick={this.submit}>Trouvez votre coiffeur</button>
            </div>
        );
    },
    submit: function () {
        var search = {
            address : this.refs.address.getFormattedAddress(),
            query   : this.refs.query.getDOMNode().value
        };

        if (!search.address) return;

        this.props.context.executeAction(SubmitSearch, {search: search});
    }
});
