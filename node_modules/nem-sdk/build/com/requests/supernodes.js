'use strict';

var _send = require('./send');

var _send2 = _interopRequireDefault(_send);

var _nodes = require('../../model/nodes');

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets all nodes of the node reward program
 *
 * @return {array} - An array of SuperNodeData objects
 */
var all = function all() {
	// Configure the request
	var options = {
		url: _nodes2.default.supernodes,
		method: 'GET'
		// Send the request
	};return (0, _send2.default)(options);
};

module.exports = {
	all: all
};
//# sourceMappingURL=supernodes.js.map