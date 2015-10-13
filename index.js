'use strict';
module.exports = function (resolve, reject, cb) {
	return function (err, result) {
		if (err && reject) {
			reject(err);
		} else if (resolve) {
			resolve(result);
		}
		if (cb) {
			cb.apply(null, arguments);
		}
	};
};
