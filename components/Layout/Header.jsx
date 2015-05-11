'use strict';

var React = require('react');
var Link = require('../Link.jsx');

module.exports = React.createClass({
    render: function () {
        var headerClassName = this.props.headerClassName ? this.props.headerClassName : 'white';
        headerClassName += ' hidden-xs';

        return (
            <header className={headerClassName}>
                <div className="row">
                    <div className="col-md-12">
                        <Link className="logo col-md-4" route="home" />
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
