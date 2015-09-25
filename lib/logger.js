
var kafka = require('kafka-node'),
    HighLevelProducer = kafka.HighLevelProducer,
    client = new kafka.Client('10.100.0.4:2181'),
    producer = new HighLevelProducer(client);

function LogMessage (level, message, context) {
    this.level = level;
    this.message = message;
    this.timestamp = (new Date()).getTime();
    this.app = 'nodejs-testcluster';
    this.node = 'NodeJS-Machine';
    this.context = context;
}

function Logger () {
    this.minLevel = 4;
    this.levelToInt = {'error': 1, 'warn': 2, 'info': 3, 'debug': 4} ;
}

Logger.prototype.error = function(message, context) {
    sendToKafka(new LogMessage('error', message, context));
}

Logger.prototype.warn = function(message, context) {
    sendToKafka(new LogMessage('warning', message, context));
}

Logger.prototype.info = function(message, context) {
    sendToKafka(new LogMessage('info', message, context));
}

Logger.prototype.debug = function(message, context) {
    sendToKafka(new LogMessage('debug', message, context));
}

Logger.prototype.setLevel = function(level) {
    this.minLevel = this.levelToInt[level];
    if(this.minLevel == undefined) {
        this.minLevel = 4;
    }
}

producer.on('ready', function() {
    console.log('Logger kafka producer ready');
});

function sendToKafka(logMessage) {
    if(logger.levelToInt[logMessage.level] > logger.minLevel) return;
    var payloads = [{
        topic: 'amdatu.rti.logs',
        messages: JSON.stringify(logMessage)
    }];

    producer.send(payloads, function(err, data) {
        if(err) {
            console.log('Error while sending log message to kafka ' + err);
        }
    });
}

var logger = module.exports = exports = new Logger;
