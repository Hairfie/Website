'use strict';

function error(target) {
	target.classList.remove('valid');
	target.classList.add('error');
}

function valid(target) {
	target.classList.add('valid');
	target.classList.remove('error');
}
var required = function(e) {
	var target = e.target;
	if (!$(target).is(':focus')) return;

	if (target.value.length > 0) valid(target);
	else error(target);
}

var email = function(e) {
	var target = e.target;
	if (!$(target).is(':focus')) return;

	var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (regex.test(target.value)) valid(target);
	else error(target);
}

var phoneNumber = function(e) {
	var target = e.target;
	if (!$(target).is(':focus')) return;

	if (target.value.length >= 10) valid(target);
	else error(target);
}

var password = function(e) {
	var target = e.target;
	if (!$(target).is(':focus')) return;

	if (target.value.length >= 6) valid(target);
	else error(target);
}

module.exports = {
	required: required,
	email: email,
	password: password,
	phoneNumber: phoneNumber
}