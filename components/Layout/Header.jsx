'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var _ = require('lodash');
var User = require('./User.jsx');

var Header = React.createClass({
    render: function () {
        var headerClassName = this.props.headerClassName ? this.props.headerClassName : 'white';
        headerClassName += ' hidden-xs';
        var proLinkNode;
        var withProLink = _.isBoolean(this.props.withProLink) ? this.props.withProLink : true;

        if(withProLink) {
            proLinkNode = (<li><Link route="home_pro">Vous êtes coiffeur ?</Link></li>);
        }

        return (
            <header className={headerClassName}>
                <div className="row">
                    <div className="col-md-12">
                        <Link className="logo col-md-4" route="home" />
                        <nav className='col-md-8 pull-right'>
                            <ul>
                                <li>
                                    <Link route="home_pro">Gérez votre salon</Link>
                                </li>
                                <User />
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
});

module.exports = Header;