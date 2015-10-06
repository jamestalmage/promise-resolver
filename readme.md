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
  var cb = promiseResolver(resolve, reject);
  
  cb(new Error('...')); // rejects promise
  cb(null, 'result'); // resolves promise
});
```

**Note:** You may not need this. Make sure you understand your promise libraries "promisify" methods first. 

## License

MIT © [James Talmage](http://github.com/jamestalmage)
