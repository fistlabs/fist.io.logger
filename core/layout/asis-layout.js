'use strict';
//  TODO separate unit tests

var strf = require('../util/strf');

/**
 * @usage
 *  logging.conf({
 *      layouts: {
 *          myLayout: {
 *              Class: 'loggin/core/layout/strf-layout',
 *              record: 'regular', //   or any other, but `Array message` variables is required
 *              kwargs: {
 *                  template: '%(date)s - %(message)s',  //  use any variables
 *                      //  that provided by record, special case is```date```
 *              }
 *          }
 *      }
 *  });
 *
 * @class AsIsLayout
 *
 * @param {Object} record
 * @param {Object} params
 * */
function AsIsLayout(record, params) {

    /**
     * @public
     * @memberOf {AsIsLayout}
     * @property
     * @type {Object}
     * */
    this.params = params = Object(params);

    /**
     * @public
     * @memberOf {AsIsLayout}
     * @property
     * @type {Object}
     * */
    this.record = record;

    /**
     * @public
     * @memberOf {AsIsLayout}
     * @property
     * @type {String}
     * */
    this.template = params.template;
}

/**
 * @public
 * @memberOf {AsIsLayout}
 * @method
 *
 * @constructs
 * */
AsIsLayout.prototype.constructor = AsIsLayout;

/**
 * @public
 * @memberOf {AsIsLayout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {String}
 * */
AsIsLayout.prototype.format = function (record) {
    return this._formatRecord(this._updateRecordAttrs(record));
};

/**
 * @protected
 * @memberOf {AsIsLayout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {Object}
 * */
AsIsLayout.prototype._updateRecordAttrs = function (record) {
    //  just format record message with passed args
    record.message = strf.format(record.message);

    return record;
};

/**
 * @protected
 * @memberOf {AsIsLayout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {Object}
 * */
AsIsLayout.prototype._formatRecord = function (record) {
    return record;
};

module.exports = AsIsLayout;
