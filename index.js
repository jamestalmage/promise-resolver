'use strict';
module.exports = makeResolver;
module.exports.defer = defer;
var bluebird = require('native-or-bluebird/promise');

function makeResolver(resolve, reject, cb) {
	var called = false;
	return function (err, result) {
		if (called) {
			return;
		}
		called = true;
		if (err && reject) {
			reject(err);
		} else if (resolve) {
			resolve(result);
		}
		if (cb) {
			cb.apply(null, arguments);
		}
	};
}

function defer(cb, Promise) {
	Promise = Promise || bluebird;
	if (!Promise) {
		throw new Error('No Promise Implementation: Install bluebird or upgrade to Node >= 0.11.13');
	}
	var obj = {};
	obj.promise = new Promise(function (resolve, reject) {
		var resolver = makeResolver(resolve, reject, cb);
		obj.cb = resolver;
		obj.resolve = resolver.bind(null, null);
		obj.reject = resolver.bind(null);
	});
	if (cb) {
		// Suppress 'unhandledRejection' events - assume the callback handles them.
		obj.promise.catch(function () {});
	}
	return obj;
}
