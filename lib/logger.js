

var kafka = require('kafka-node'),
    HighLevelProducer = kafka.HighLevelProducer,
    client = new kafka.Client('10.100.0.4:2181'),
    producer = new HighLevelProducer(client);

function LogMessage (level, message) {
    this.level = level;
    this.message = message;
    this.timestamp = (new Date()).getTime();
    this.app = 'nodejs-testcluster';
    this.node = 'NodeJS-Machine';

}

function Logger () {
    this.minLevel = 4;
    this.levelToInt = {'error': 1, 'warn': 2, 'info': 3, 'debug': 4} ;
}

Logger.prototype.error = function(message) {
    console.log('error: ' + message);
    sendToKafka(new LogMessage('error', message));
}

Logger.prototype.warn = function(message) {
    console.log('warning: ' + message);
    sendToKafka(new LogMessage('warning', message));
}

Logger.prototype.info = function(message) {
    console.log('info: ' + message);
    sendToKafka(new LogMessage('info', message));
}

Logger.prototype.debug = function(message) {
    console.log('debug: ' + message);
    sendToKafka(new LogMessage('debug', message));
}

Logger.prototype.setLevel = function(level) {
    this.minLevel = this.levelToInt[level];
    if(this.minLevel == undefined) {
        this.minLevel = 4;
    }
}

var logger = module.exports = exports = new Logger;

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
