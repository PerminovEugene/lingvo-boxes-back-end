const auth = require('./auth')
    , home = require('./home');

module.exports.addRoutes = (app) => {
    auth(app);
    home(app);
};