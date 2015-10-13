# promise-resolver [![Build Status](https://travis-ci.org/jamestalmage/promise-resolver.svg?branch=master)](https://travis-ci.org/jamestalmage/promise-resolver)

> Turn a promises resolver methods into a node style callback

## Install

```
$ npm install --save promise-resolver
```

## Usage

```js
var promiseResolver = require('promise-resolver');

new Promise(function (resolve, reject) {
  var cb = promiseResolver(resolve, reject, passThroughCallback);
  
  cb(new Error('...')); // rejects promise and calls passThroughCallback with same args
  cb(null, 'result'); // resolves promise and calls passThroughCallback with same args
});
```
## API

### promiseResolver(resolve, reject, passThrough) 

All arguments should be functions, null, or undefined.

* `resolve` - promise resolve function
* `reject` - promise reject function
* `passThrough` - a "pass through" node style (error first) callback.

Returns a node style callback: `cb(err, result...)`

Calling the callback will resolve or reject the promise (depending on the `err` argument).
If it exists, the `passThrough` callback will be called with the same arguments. 

## License

MIT © [James Talmage](http://github.com/jamestalmage)
