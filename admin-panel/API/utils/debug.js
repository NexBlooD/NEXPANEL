function logDebug(message, ...optionalParams) {
    const config = require('../config/config');
    if (config.debug) {
        console.log(message, ...optionalParams);
    }
}

module.exports = { logDebug };
