'use strict';

var _ = require('lodash');
var kafka = require('kafka-node'),
    HighLevelProducer = kafka.HighLevelProducer,
    client = new kafka.Client(),// by default connect to localhost:2181
    producer = new HighLevelProducer(client);

var ProbeData = require('./probe-data');

/**
 * Probe constructor.
 *
 * The exports object of the 'rti-nodejs' module is an instance of this class.
 * @api public
 */
function ProbeController() {
    this.probes = {};
    setInterval(getProbeInfo, 1000 * 10);
}

/**
 * Add a new probe callback
 *
 * @param {String} name
 * @param {Function} callback
 * @returns {ProbeController}
 */
ProbeController.prototype.add = function(name, callback) {
    console.log('Adding probe ' + name);
    this.probes[name] = callback;
    return this;
}

/**
 * Remove the callback with the given name from the probes
 *
 * @param {String} name
 */
ProbeController.prototype.remove = function(name) {
    console.log('Removing probe ' + name);
    delete this.probes.name;
}

ProbeController.prototype.ProbeData = ProbeData;

function getProbeInfo() {

    // aggregate probe data
    var probeEvent = {};
    probeEvent.cluster = 'nodejs-testcluster';
    probeEvent.node = 'Ralucas-MBP';
    probeEvent.httpPort = '8181';
    probeEvent.timeStamp = (new Date()).getTime();
    probeEvent.data = [];

    var probeData = _.mapValues(probeController.probes, function(callback) {
        return  callback();
    });

    _.forEach(probeData, function(data) {
        probeEvent.data.push(data);
    });

    var healthcheckData = _.filter(probeEvent.data, function(data) {
        return data.healthy !== undefined;
    });

    var unhealthyData = _.filter(healthcheckData, function(data) {
        return !data.healthy;
    });

    probeEvent.healthy = unhealthyData.length == 0;

    console.log('Sending probe event to kafka ' + JSON.stringify(probeEvent));

    // send it to the kafka backend
    var payloads = [{
        topic: 'amdatu.rti.healthcheck',
        messages: JSON.stringify(probeEvent)
    }];

    producer.send(payloads, function(err, data) {
        if(err) {
            console.log('Error while sending message to kafka ' + err);
        }
    });
}

producer.on('ready', function() {
    console.log('Kafka producer ready');
});

var probeController = module.exports = exports = new ProbeController;
