/** @jsx React.DOM */

'use strict';

var React = require('react');

var Kinds = require('../../constants/BusinessConstants').Kinds;

module.exports = React.createClass({
    render: function () {
        var business = this.props.business || {},
            address  = business.address ? business.address : {};

        return (
            <div>
                <div className="form-group">
                    <label>Name</label>
                    <input ref="name" type="text" className="form-control" defaultValue={business.name} />
                </div>
                <div className="form-group">
                    <label>Kind</label>
                    <select ref="kind" className="form-control" defaultValue={business.kind}>
                        <option value={Kinds.SALON}>Salon</option>
                        <option value={Kinds.HOME}>Home</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Phone number</label>
                    <input ref="phoneNumber" type="text" className="form-control" defaultValue={business.phoneNumber} />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input ref="street" type="text" className="form-control" defaultValue={address.street} />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input ref="city" type="text" className="form-control" defaultValue={address.city} />
                </div>
                <div className="form-group">
                    <label>Zip code</label>
                    <input ref="zipCode" type="text" className="form-control" defaultValue={address.zipCode} />
                </div>
                <div className="form-group">
                    <label>Country</label>
                    <select ref="country" className="form-control" defaultValue={address.country}>
                        <option value="FR">France</option>
                    </select>
                </div>
            </div>
        );
    },
    getValues: function () {
        return {
            name        : this.refs.name.getDOMNode().value,
            kind        : this.refs.name.getDOMNode().value,
            phoneNumber : this.refs.name.getDOMNode().value,
            address: {
                street  : this.refs.street.getDOMNode().value,
                city    : this.refs.city.getDOMNode().value,
                zipCode : this.refs.zipCode.getDOMNode().value,
                country : this.refs.country.getDOMNode().value
            }
        }
    }
});
