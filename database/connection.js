const { connect, connection} = require('mongoose');
const config = require('../config/config');
const log = require('../utils/logger');

connect(config.mongo.token, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

connection.on('connected', () => {
    log.success(`[DATABASE] Connect to MongoDB.`);
});

connection.on('err', err => {
    log.error(`[DATABASE] ${err.message}`);
});

connection.on('disconnected', () => {
    log.warn(`[DATABASE] Disconnecting from MongoDB`);
});
