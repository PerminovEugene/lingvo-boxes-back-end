const bcrypt = require('bcrypt');

module.exports.hashSync = (message, salt) => {
    return bcrypt.hashSync(message.toString(), salt);
};

module.exports.genSaltSync = (rounds = 16) => {
    return bcrypt.genSaltSync(rounds);
};