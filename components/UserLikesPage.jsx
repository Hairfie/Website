'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('../lib/connectToStores');
var UserLayout = require('./UserPage/Layout.jsx');
var Link = require('./Link.jsx');

var UserLikesPage = React.createClass({
    render: function () {
        return(
            <UserLayout user={this.props.user} tab="likes">
                {/*<div className="row">
                    {_.map(this.props.hairfies, function (hairfie) {
                        var hairdresser = <p>&nbsp;</p>;
                        if (hairfie.hairdresser) {
                            hairdresser = <p>Coiffé par <span>{displayName(hairfie.hairdresser)}</span></p>;
                        }

                        var price;
                        if (hairfie.price) {
                            price = <div className="pricetag">{hairfie.price.amount}€</div>;
                        }

                        return (
                            <div key={hairfie.id} className="col-md-3 single-hairfie">
                                <figure>
                                    <Link route="hairfie" params={{ hairfieId: hairfie.id }}>
                                        <Picture picture={_.last(hairfie.pictures)}
                                                resolution={{width: 640, height: 640}}
                                                placeholder="/images/placeholder-640.png"
                                                alt="" />
                                                <figcaption>
                                                    {hairdresser}
                                                    <p><span>Le {moment(hairfie.createdAt).format('L')}</span></p>
                                                    {price}
                                                </figcaption>
                                            </Link>
                                        </figure>
                                    </div>
                                );
                            }, this)}
                        </div>*/}
            </UserLayout>
        );
    }
});

UserLikesPage = connectToStores(UserLikesPage, [
    'UserStore'
], function (stores, props) {
    return {
        user: stores.UserStore.getById(props.route.params.userId)
    };
});

module.exports = UserLikesPage;