'use strict';
const deburr = require('lodash.deburr');
const escapeStringRegexp = require('escape-string-regexp');
const builtinReplacements = require('./replacements');

if (!Object.keys) Object.keys = function(o) {
  if (o !== Object(o))
    throw new TypeError('Object.keys called on a non-object');
  var k=[],p;
  for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
  return k;
}

function objAssign(objs) {
	return objs.reduce(function (r, o) {
        	Object.keys(o).forEach(function (k) { r[k] = o[k]; });
        	return r;
    	}, {});
};

const doCustomReplacements = (string, replacements) => {
	return replacements.reduce(function (result, replacement) {
		var key = replacement[0],
		    value = replacement[1];
		if (typeof key !== 'string') return result;
		// TODO: Use `String#replaceAll()` when targeting Node.js 16.
		return result.replace(new RegExp(escapeStringRegexp(key), 'g'), value);
	}, string);
};

module.exports = (string, options) => {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a string, got \`${typeof string}\``);
	}

	options = objAssign([{
		customReplacements: [],
	}, options]);

	const customReplacements = [].concat(builtinReplacements).concat(options.customReplacements).filter(Boolean);

	string = string.normalize();
	string = doCustomReplacements(string, customReplacements);
	string = deburr(string);

	return string;
};
