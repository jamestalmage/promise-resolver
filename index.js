'use strict';
module.exports = function (resolve, reject) {
	return function (err, result) {
		if (err) {
			reject(err);
		} else {
			resolve(result);
		}
	};
};
