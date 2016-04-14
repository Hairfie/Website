'use strict';

var React = require('react');
var _ = require('lodash');
var PlaceActions = require('../../actions/PlaceActions');
var GeoInput = require('../Form/PlaceAutocompleteInput.jsx');


var LocationInput = React.createClass ({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getStateFromProps(nextProps));
        if (this.state.isGeolocated && (nextProps.currentPosition != this.getValue())) {
            this.refs.address.refs.input.value = nextProps.currentPosition;
            this.setState({isGeolocated: false});
        }
    },
    getStateFromProps: function(props) {
        return {
            search: props.initialSearch,
            isGeolocated: (this.state && this.state.isGeolocated) || false
        }
    },
    render: function () {
        var aroundText = <span className='around-text'>Autour de moi</span>;
        if (this.state.isGeolocated) {
            aroundText = (
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            );
        }
        return (
            <div className="location">
                <span className='title'>Localisation</span>
                <hr className='underliner'/>
                <div className="input-group">
                    <GeoInput className="form-control" ref="address" type="text" 
                        onChange={this.handleLocationChange} 
                        defaultValue={this.state.search.address != 'France' ? this.state.search.address : ''}/>
                    <div className="input-group-addon"><a role="button" onClick={this.props.onSubmit}> </a></div>
                </div>
                <div>
                    <button className="btn btn-around" onClick={this.locateMe}>{aroundText}</button>
                </div>
            </div>
        );
    },
    getValue: function () {
        if (this.refs.address.refs.input.value == '') return 'France';
        return this.refs.address.getFormattedAddress();
    },
    locateMe: function() {
        this.setState({isGeolocated: true});
        this.context.executeAction(PlaceActions.getPlaceByGeolocation);
    },
    handleLocationChange: function() {
        this.setState({isGeolocated: false});
    }
});

module.exports = LocationInput;