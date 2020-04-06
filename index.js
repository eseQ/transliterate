'use strict';
const deburr = require('lodash.deburr');
const escapeStringRegexp = require('escape-string-regexp');
const builtinReplacements = require('./replacements');

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

	options = Object.assign({
		customReplacements: [],
	}, options);

	const customReplacements = [].concat(builtinReplacements).concat(options.customReplacements).filter(Boolean);

	string = string.normalize();
	string = doCustomReplacements(string, customReplacements);
	string = deburr(string);

	return string;
};
