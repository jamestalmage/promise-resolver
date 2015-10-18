# promise-resolver [![Build Status](https://travis-ci.org/jamestalmage/promise-resolver.svg?branch=master)](https://travis-ci.org/jamestalmage/promise-resolver)

> Turn a promises resolver methods into a node style callback


## Install

```
$ npm install --save promise-resolver
```


## Usage

```js
var promiseResolver = require('promise-resolver');

// creates a standard "defer" object, with added "cb" property.
var defer = promiseResolver.defer(passThroughCallback);   

// rejects promise and calls passThroughCallback with same args
defer.cb(new Error('...')); 

// resolves promise and calls passThroughCallback with same args
defer.cb(null, 'result'); 

return defer.promise;
```

* `defer.cb` will resolve/reject the promise and call `passThroughCallback`
* Ensures that `passThroughCallback` is only called once.
* If `passThroughCallback` is provided, it is assumed to handle any errors, and so `unhandledRejection` errors on 
  the promise will be suppressed. This avoids potentially confusing console warnings if users are handling errors
  via a callback and ignoring the returned promise. 
* `defer.resolve` and `defer.reject` behave as expected.


## Alternate Usage

```js                       
var promiseResolver = require('promise-resolver');

return new Promise(function (resolve, reject) {
  var cb = promiseResolver(resolve, reject, passThroughCallback);
  
  cb(new Error('...'));
  
  cb(null, 'result');
});
```

This behaves similar to the `defer` method, with the only exception being that `unhandledRejection` errors are *not* 
automatically suppressed when `passThroughCallback` is supplied.


## API

### promiseResolver(resolve, reject, passThrough) 

All arguments should be functions, null, or undefined.

* `resolve` - promise resolve function
* `reject` - promise reject function
* `passThrough` - a "pass through" node style (error first) callback.

Returns a node style callback: `cb(err, result...)`

Calling the callback will resolve or reject the promise (depending on the `err` argument).
If it exists, the `passThrough` callback will be called with the same arguments.
 
 
### promiseResolver.defer(passThrough, Promise)

* `passThrough` - a "pass through" node style callback as described above
* `Promise` - an alternate Promise constructor (will use `global.Promise` or `bluebird` by default).

The return value is a standard `defer` object with an additional `cb` property
that is a node style resolver callback.
 
```js
var defer = promiseResolver(passThroughCallback);
var cb = defer.cb;
  
cb(new Error('...')); // rejects promise and calls passThroughCallback with same args
cb(null, 'result'); // resolves promise and calls passThroughCallback with same args

return defer.promise;
```

`defer.resolve`, and `defer.reject` are also available on the defer object.


## License

MIT © [James Talmage](http://github.com/jamestalmage)
