'use strict';
require('co-mocha');
var sinon = require('sinon');
var assertSpy = sinon.assert;
var assert = require('assert');
var proxyquire = require('proxyquire');

var promiseResolver = require('./');
var noPromiseResolver = proxyquire('./', {'native-or-bluebird/promise': false});

var resolve;
var reject;
var cb;
var resolver;
var PromiseStub;

function timeout(delay) {
	return new Promise(resolve => setTimeout(resolve, typeof delay === 'number' ? delay : 30));
}

beforeEach(() => {
	resolve = sinon.spy();
	reject = sinon.spy();
	cb = sinon.spy();

	PromiseStub = sinon.spy(function (fn) {
		fn(resolve, reject);
		return {
			then: sinon.spy(),
			catch: sinon.spy()
		};
	});
});

it('rejects with first argument', function () {
	resolver = promiseResolver(resolve, reject);
	var err = new Error('err');
	resolver(err, 'hello!');
	assertSpy.notCalled(resolve);
	assertSpy.calledOnce(reject);
	assertSpy.calledWith(reject, err);
});

it('resolves with second argument', function () {
	resolver = promiseResolver(resolve, reject);
	resolver(null, 'howdy!');
	assertSpy.notCalled(reject);
	assertSpy.calledOnce(resolve);
	assertSpy.calledWith(resolve, 'howdy!');
});

it('calls callback with error', function *() {
	resolver = promiseResolver(null, null, cb);
	var err = new Error('err');
	resolver(err, 'hello!');
	yield timeout();
	assertSpy.calledOnce(cb);
	assertSpy.calledWith(cb, err, 'hello!');
});

it('calls callback with result', function *() {
	resolver = promiseResolver(null, null, cb);
	resolver(null, 'hello!');
	yield timeout();
	assertSpy.calledOnce(cb);
	assertSpy.calledWith(cb, null, 'hello!');
});

it('calls reject and callback with error', function *() {
	resolver = promiseResolver(resolve, reject, cb);
	var err = new Error('err');
	resolver(err, 'hello!');
	yield timeout();
	assertSpy.notCalled(resolve);
	assertSpy.calledOnce(reject);
	assertSpy.calledWith(reject, err);
	assertSpy.calledOnce(cb);
	assertSpy.calledWith(cb, err, 'hello!');
});

it('calls resolve and callback with result', function *() {
	resolver = promiseResolver(resolve, reject, cb);
	resolver(null, 'goodbye!');
	yield timeout();
	assertSpy.notCalled(reject);
	assertSpy.calledOnce(resolve);
	assertSpy.calledWith(resolve, 'goodbye!');
	assertSpy.calledOnce(cb);
	assertSpy.calledWith(cb, null, 'goodbye!');
});

it('will only call cb once', function *() {
	resolver = promiseResolver(resolve, reject, cb);
	resolver(null, 'goodbye!');
	yield timeout();
	assertSpy.calledOnce(cb);
	resolver(null, 'hello!');
	yield timeout();
	assertSpy.calledOnce(cb);
	assertSpy.calledWith(cb, null, 'goodbye!');
});

it('defer() creates a defer object', function *() {
	var defer = promiseResolver.defer(cb, PromiseStub);
	resolver = defer.cb;
	assert.strictEqual(typeof defer.resolve, 'function');
	assert.strictEqual(typeof defer.reject, 'function');
	assert.strictEqual(typeof defer.promise.then, 'function');
	assert.strictEqual(typeof defer.promise.catch, 'function');

	resolver(null, 'goodbye!');
	yield timeout();

	assertSpy.notCalled(reject);
	assertSpy.calledOnce(resolve);
	assertSpy.calledWith(resolve, 'goodbye!');
	assertSpy.calledOnce(cb);
	assertSpy.calledWith(cb, null, 'goodbye!');
});

it('defer() suppresses unhandledRejection if cb is provided', function *() {
	var spy = sinon.spy();
	process.once('unhandledRejection', spy);
	promiseResolver.defer(cb).cb(new Error('hello'));
	yield timeout();
	assertSpy.notCalled(spy);
});

it('defer() does NOT suppress unhandledRejection if cb is NOT provided', function *() {
	var spy = sinon.spy();
	process.once('unhandledRejection', spy);
	promiseResolver.defer().cb(new Error('hello'));
	yield timeout();
	assertSpy.called(spy);
});

it('defer().reject will call callback with error as first arg', function *() {
	promiseResolver.defer(cb).reject(new Error('defer.reject'));
	yield timeout();
	assertSpy.calledWith(cb, sinon.match.has('message', 'defer.reject'));
});

it('defer().resolve will result to callback as second arg', function *() {
	promiseResolver.defer(cb).resolve('hello');
	yield timeout();
	assertSpy.calledWith(cb, null, 'hello');
});

it('defer().resolve works using a callback even if there is no installed promise implementation', function *() {
	noPromiseResolver.defer(cb).resolve('hello');
	yield timeout();
	assertSpy.calledWith(cb, null, 'hello');
});

it('defer().reject works using a callback even if there is no installed promise implementation', function *() {
	noPromiseResolver.defer(cb).reject(new Error('uh oh'));
	yield timeout();
	assertSpy.calledWith(cb, sinon.match.has('message', 'uh oh'));
});

it('defer().reject(null) rejects a promise, even though error is falsie', function *() {
	promiseResolver.defer(cb, PromiseStub).reject(null);
	yield timeout();
	assertSpy.calledWith(cb, sinon.match.has('message', 'reject called with falsie reason'));
	assertSpy.calledWith(reject, sinon.match.has('message', 'reject called with falsie reason'));
});

it('defer() will throw without an installed promise implementation or supplied callback', function () {
	assert.throws(function () {
		noPromiseResolver.defer();
	}, /No Promise Implementation/);
});
