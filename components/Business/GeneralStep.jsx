/** @jsx React.DOM */

var React = require('react');

var Kinds = require('../../constants/BusinessClaimConstants').Kinds;

module.exports = React.createClass({
    render: function () {
        var claim = this.props.businessClaim;

        return (
            <div>
                <h3>General Infos</h3>
                <div>
                    <label>
                        Name:
                        <input ref="name" type="text" defaultValue={claim.name} />
                    </label>
                </div>
                <div>
                    <label>
                        Kind:
                        <select ref="kind" defaultValue={claim.kind}>
                            <option value={Kinds.SALON}>Salon</option>
                            <option value={Kinds.HOME}>Home</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Phone number:
                        <input ref="phoneNumber" type="text" defaultValue={claim.phoneNumber} />
                    </label>
                </div>
            </div>
        );
    },
    applyChanges: function () {
        this.props.businessClaim.name = this.refs.name.getDOMNode().value;
        this.props.businessClaim.kind = this.refs.kind.getDOMNode().value;
        this.props.businessClaim.phoneNumber = this.refs.phoneNumber.getDOMNode().value;
    }
});
