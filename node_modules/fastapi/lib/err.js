'use strict';

const util = require('util');
const assert = require('assert');

Error.extend = function(subTypeName, toString) {

	assert(subTypeName, 'subTypeName is required');

	let SubType = (function(message, data) {

		if (! (this instanceof SubType)) {
			return new SubType(message);
		}

		this.name = subTypeName;
		this.message = message || '';
		this.data = data;

		Error.captureStackTrace(this, this.constructor);
	});

	util.inherits(SubType, this);

    if (typeof toString === 'function') {
        SubType.prototype.toString = toString;
    } else {
        SubType.prototype.toString = function() {
            return this.name + ': ' + util.inspect(this.message);
        };
    }

	SubType.extend = this.extend;

	return SubType;
};

module.exports = Error;
