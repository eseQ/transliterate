'use strict';
const deburr = require('lodash.deburr');
const escapeStringRegexp = require('escape-string-regexp');
const builtinReplacements = require('./replacements');

const doCustomReplacements = (string, replacements) => {
	for (const [key, value] of replacements) {
		if (typeof key !== 'string') return;
		// TODO: Use `String#replaceAll()` when targeting Node.js 16.
		string = string.replace(new RegExp(escapeStringRegexp(key), 'g'), value);
	}

	return string;
};

module.exports = (string, options) => {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a string, got \`${typeof string}\``);
	}

	options = Object.assign({
		customReplacements: [],
	}, options);
	
	const customReplacementsArray = options.customReplacements instanceof Map
		? Array.from(options.customReplacements.entries())
		: options.customReplacements;

	const customReplacements = new Map(
		[].concat(builtinReplacements).concat(customReplacementsArray).filter(Boolean)
	);

	string = string.normalize();
	string = doCustomReplacements(string, customReplacements);
	string = deburr(string);

	return string;
};
