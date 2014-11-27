/** @jsx React.DOM */

var React = require('react');

var UserStatus = require('./UserStatus.jsx');
var HeaderPro = require('./HeaderPro.jsx');
var Footer = require('./Footer.jsx');


module.exports = React.createClass({
    displayName: 'PublicLayout',
    render: function () {
        return (
            <div className="proLayout">
                <HeaderPro context={this.props.context} />
                <div className={ 'container-fluid ' + this.props.customClass }>
                    <div className="row">
                        <div className="col-sm-3 col-md-2 sidebar">
                            <ul className="nav nav-sidebar">
                                <li className="active"><a href="#">Infos <span className="icon icon-right-arrow" aria-hidden="true"></span></a></li>
                                <li><a href="#">Vos Coiffeurs <span className="icon icon-right-arrow" aria-hidden="true"></span></a></li>
                                <li><a href="#">Horaires <span className="icon icon-right-arrow" aria-hidden="true"></span></a></li>
                                <li><a href="#">Prix <span className="icon icon-right-arrow" aria-hidden="true"></span></a></li>
                            </ul>
                        </div>
                        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
