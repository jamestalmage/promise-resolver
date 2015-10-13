'use strict';
var sinon = require('sinon');
var assertSpy = sinon.assert;
var assert = require('assert');
var promiseResolver = require('./');

var resolve;
var reject;
var cb;
var resolver;
var PromiseStub;

beforeEach(function () {
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

it('calls callback with error', function () {
	resolver = promiseResolver(null, null, cb);
	var err = new Error('err');
	resolver(err, 'hello!');
	assertSpy.calledOnce(cb);
	assertSpy.calledWith(cb, err, 'hello!');
});

it('calls callback with result', function () {
	resolver = promiseResolver(null, null, cb);
	resolver(null, 'hello!');
	assertSpy.calledOnce(cb);
	assertSpy.calledWith(cb, null, 'hello!');
});

it('calls reject and callback with error', function () {
	resolver = promiseResolver(resolve, reject, cb);
	var err = new Error('err');
	resolver(err, 'hello!');
	assertSpy.notCalled(resolve);
	assertSpy.calledOnce(reject);
	assertSpy.calledWith(reject, err);
	assertSpy.calledOnce(cb);
	assertSpy.calledWith(cb, err, 'hello!');
});

it('calls resolve and callback with result', function () {
	resolver = promiseResolver(resolve, reject, cb);
	resolver(null, 'goodbye!');
	assertSpy.notCalled(reject);
	assertSpy.calledOnce(resolve);
	assertSpy.calledWith(resolve, 'goodbye!');
	assertSpy.calledOnce(cb);
	assertSpy.calledWith(cb, null, 'goodbye!');
});

it('defer() creates a defer object', function () {
	var defer = promiseResolver.defer(cb, PromiseStub);
	resolver = defer.cb;
	assert.strictEqual(defer.resolve, resolve);
	assert.strictEqual(defer.reject, reject);
	assert.strictEqual(typeof defer.promise.then, 'function');
	assert.strictEqual(typeof defer.promise.catch, 'function');

	resolver(null, 'goodbye!');
	assertSpy.notCalled(reject);
	assertSpy.calledOnce(resolve);
	assertSpy.calledWith(resolve, 'goodbye!');
	assertSpy.calledOnce(cb);
	assertSpy.calledWith(cb, null, 'goodbye!');
});
