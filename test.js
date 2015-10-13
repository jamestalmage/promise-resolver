'use strict';
var sinon = require('sinon');
var assert = sinon.assert;
var promiseResolver = require('./');

var resolve;
var reject;
var cb;
var resolver;

beforeEach(function () {
	resolve = sinon.spy();
	reject = sinon.spy();
	cb = sinon.spy();
});

it('rejects with first argument', function () {
	resolver = promiseResolver(resolve, reject);
	var err = new Error('err');
	resolver(err, 'hello!');
	assert.notCalled(resolve);
	assert.calledOnce(reject);
	assert.calledWith(reject, err);
});

it('resolves with second argument', function () {
	resolver = promiseResolver(resolve, reject);
	resolver(null, 'howdy!');
	assert.notCalled(reject);
	assert.calledOnce(resolve);
	assert.calledWith(resolve, 'howdy!');
});

it('calls callback with error', function () {
	resolver = promiseResolver(null, null, cb);
	var err = new Error('err');
	resolver(err, 'hello!');
	assert.calledOnce(cb);
	assert.calledWith(cb, err, 'hello!');
});

it('calls callback with result', function () {
	resolver = promiseResolver(null, null, cb);
	resolver(null, 'hello!');
	assert.calledOnce(cb);
	assert.calledWith(cb, null, 'hello!');
});

it('calls reject and callback with error', function () {
	resolver = promiseResolver(resolve, reject, cb);
	var err = new Error('err');
	resolver(err, 'hello!');
	assert.notCalled(resolve);
	assert.calledOnce(reject);
	assert.calledWith(reject, err);
	assert.calledOnce(cb);
	assert.calledWith(cb, err, 'hello!');
});

it('calls resolve and callback with result', function () {
	resolver = promiseResolver(resolve, reject, cb);
	resolver(null, 'goodbye!');
	assert.notCalled(reject);
	assert.calledOnce(resolve);
	assert.calledWith(resolve, 'goodbye!');
	assert.calledOnce(cb);
	assert.calledWith(cb, null, 'goodbye!');
});
