'use strict';

var React = require('react');
var objectAssign = require('lodash').assign;

module.exports = function connectToStores(Component, stores, getStateFromStores) {
    var componentName = Component.displayName || Component.name;
    var StoreConnector = React.createClass({
        displayName: componentName + 'StoreConnector',
        contextTypes: {
            getStore: React.PropTypes.func
        },
        getInitialState: function getInitialState() {
            return this.getStateFromStores(this.props);
        },
        componentDidMount: function componentDidMount() {
            stores.forEach(function storesEach(Store) {
                this.context.getStore(Store).addChangeListener(this._onStoreChange);
            }, this);
        },
        componentWillUnmount: function componentWillUnmount() {
            stores.forEach(function storesEach(Store) {
                this.context.getStore(Store).removeChangeListener(this._onStoreChange);
            }, this);
        },
        componentWillReceiveProps: function (nextProps) {
            this.setState(this.getStateFromStores(nextProps));
        },
        getStateFromStores: function (props) {
            if ('function' === typeof getStateFromStores) {
                var storeInstances = {};
                stores.forEach(function (store) {
                    var storeName = store.name || store.storeName || store;
                    storeInstances[storeName] = this.context.getStore(store);
                }, this);
                return getStateFromStores(storeInstances, props);
            }
            var state = {};
            //@TODO deprecate?
            Object.keys(getStateFromStores).forEach(function (storeName) {
                var stateGetter = getStateFromStores[storeName];
                var store = this.context.getStore(storeName);
                objectAssign(state, stateGetter(store, props));
            }, this);
            return state;
        },
        _onStoreChange: function onStoreChange() {
            this.setState(this.getStateFromStores(this.props));
        },
        render: function render() {
            return React.createElement(Component, objectAssign({}, this.props, this.state));
        }
    });

    return StoreConnector
};
