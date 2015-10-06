'use strict';
var assert = require('assert');
var sinon = require('sinon');
var promiseResolver = require('./');

var resolve;
var reject;
var cb;

beforeEach(function () {
	resolve = sinon.spy();
	reject = sinon.spy();
	cb = promiseResolver(resolve, reject);
});

it('rejects with first argument', function () {
	var err = new Error('err');
	cb(err, 'hello!');
	assert(!resolve.called);
	assert.strictEqual(reject.callCount, 1);
	assert.deepEqual(reject.firstCall.args, [err]);
});

it('resolves with second argument', function () {
	cb(null, 'howdy!');
	assert(!reject.called);
	assert.strictEqual(resolve.callCount, 1);
	assert.deepEqual(resolve.firstCall.args, ['howdy!']);
});
