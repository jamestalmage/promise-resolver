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
	var callback;
	var promise;
	if (Promise) {
		promise = new Promise(function (resolve, reject) {
			callback = makeResolver(resolve, reject, cb);
		});
		if (cb) {
			// Suppress 'unhandledRejection' events - assume the callback handles them.
			promise.catch(function () {});
		}
	} else if (cb) {
		callback = cb;
	} else {
		throw new Error('No Promise Implementation: Install bluebird, upgrade to Node >= 0.11.13, or use a callback');
	}

	return {
		cb: callback,
		resolve: callback.bind(null, null),
		reject: callback,
		promise: promise
	};
}
