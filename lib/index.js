'use strict';

var ProbeController = require('./probe-controller');
var Logger = require('./logger');

function rti() {
}

rti.prototype.ProbeController = ProbeController;
rti.prototype.Logger = Logger;

var rti = module.exports = exports = new rti();