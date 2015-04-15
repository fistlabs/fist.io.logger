'use strict';

var R_TOKENS = /^(?:%(?:\(((?:[^()]+|"[^"]*"|'[^']*')+)\))?([+-])?(\d+)?(?:\.(\d+))?([a-z])|([^%]+)|%?(%))/;

var hasProperty = Object.prototype.hasOwnProperty;
var get = require('obus').get;

/**
 * @class StringFormatter
 * */
function StringFormatter() {

    /**
     * @public
     * @memberOf {StringFormatter}
     * @property
     * @type {Object}
     * */
    this.cache = {};

    /**
     * @public
     * @memberOf {StringFormatter}
     * @property
     * @type {Object}
     * */
    this.types = {};
}

StringFormatter.prototype.constructor = StringFormatter;

/**
 * @public
 * @memberOf {StringFormatter}
 * @method
 *
 * @param {String} s
 *
 * @returns {Object}
 * */
StringFormatter.prototype.parse = function (s) {
    if (!hasProperty.call(this.cache, s)) {
        this.cache[s] = this.parsePattern(s);
    }

    return this.cache[s];
};

/**
 * @private
 * @memberOf {StringFormatter}
 * @method
 *
 * @param {String} s
 *
 * @returns {Array}
 * */
StringFormatter.prototype.parsePattern = function (s) {
    var match;
    var parts = [];

    /*eslint no-cond-assign: 0*/
    while (match = R_TOKENS.exec(s)) {
        s = s.substr(match[0].length);

        if (!match[5]) {
            parts[parts.length] = match[6] || match[7];
            continue;
        }

        if (typeof this.types[match[5]] !== 'function') {
            parts[parts.length] = match[0];
            continue;
        }

        parts[parts.length] = [match[5], match[1], match[2], match[3], match[4], match[0]];
    }

    return parts;
};

/**
 * @public
 * @memberOf {StringFormatter}
 * @method
 *
 * @param {String} type
 * @param {Function} func
 *
 * @returns {StringFormatter}
 * */
StringFormatter.prototype.addType = function (type, func) {
    this.types[type] = func;
    return this;
};

/**
 * @public
 * @memberOf {StringFormatter}
 * @method
 *
 * @param {String} patternString
 * @param {Array} args
 * @param {Number} ofs
 * @param {Function} inspect
 *
 * @returns {String}
 * */
StringFormatter.prototype.formatPattern = function (patternString, args, ofs, inspect) {
    var i;
    var l;
    var part;
    var s = '';
    var value;
    var pos = Math.max(0, ofs);
    var parts = this.parse(patternString);
    var usesKwargs = false;

    for (i = 0, l = parts.length; i < l; i += 1) {
        part = parts[i];

        if (typeof part === 'string') {
            s += part;
            continue;
        }

        if (part[1]) {
            usesKwargs = true;
            value = get(args[args.length - 1], part[1]);
        } else {
            value = args[pos];
            pos += 1;
        }

        if (typeof value === 'function') {
            value = value();
        }

        s += this.types[part[0]](value, part[2], part[3], part[4]);
    }

    return s + this.inspectArgs(args, pos, Number(usesKwargs), ' ', inspect);
};

/**
 * @public
 * @memberOf {StringFormatter}
 * @method
 *
 * @param {Array} sign
 * @param {Function} inspect
 *
 * @returns {String}
 * */
StringFormatter.prototype.formatSign = function (sign, inspect) {
    if (typeof sign[0] === 'string') {
        return this.formatPattern(sign[0], sign, 1, inspect);
    }

    return this.inspectArgs(sign, 0, 0, '', inspect);
};

/**
 * @public
 * @memberOf {StringFormatter}
 * @method
 *
 * @param {Array} args
 * @param {Number} ofsL
 * @param {Number} ofsR
 * @param {String} s
 * @param {Function} inspect
 *
 * @returns {String}
 * */
StringFormatter.prototype.inspectArgs = function (args, ofsL, ofsR, s, inspect) {
    var l = args.length - ofsR;

    if (l - ofsL < 1) {
        return '';
    }

    s += inspect(args[ofsL]);
    ofsL += 1;

    while (ofsL < l) {
        s += ' ' + inspect(args[ofsL]);
        ofsL += 1;
    }

    return s;
};

module.exports = StringFormatter;
