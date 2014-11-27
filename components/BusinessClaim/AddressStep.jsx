/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
    render: function () {
        var address = this.props.businessClaim.address || {};

        return (
            <div>
                <div>
                    <label>
                        Street:
                        <input ref="street" type="text" defaultValue={address.street} />
                    </label>
                </div>
                <div>
                    <label>
                        City:
                        <input ref="city" type="text" defaultValue={address.city} />
                    </label>
                </div>
                <div>
                    <label>
                        Zip code:
                        <input ref="zipCode" type="text" defaultValue={address.zipCode} />
                    </label>
                </div>
                <div>
                    <label>
                        Country:
                        <select ref="country" defaultValue={address.country}>
                            <option value="FR">France</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    },
    applyChanges: function () {
        this.props.businessClaim.address = {
            street: this.refs.street.getDOMNode().value,
            city: this.refs.city.getDOMNode().value,
            zipCode: this.refs.zipCode.getDOMNode().value,
            country: this.refs.country.getDOMNode().value
        };
    }
});
