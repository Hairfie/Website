'use strict';

var React = require('react');
var NavLink = require('flux-router-component').NavLink;

module.exports = React.createClass({
    render: function () {
        var headerClassName = this.props.headerClassName ? this.props.headerClassName : 'white';
        headerClassName += ' hidden-xs';

        return (
            <header className={headerClassName}>
                <div className="row">
                    <div className="col-md-12">
                        <NavLink className="logo col-md-4" routeName="home" />
                        <nav className='col-md-8 pull-right'>
                            <ul>
                                <li><a href="http://pro.hairfie.com" className="">Vous êtes coiffeur ?</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
});
