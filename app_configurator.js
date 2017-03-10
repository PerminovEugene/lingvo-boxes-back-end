const cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , session = require('express-session');

module.exports.configure = (app) => {
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({ secret: process.env.SESSION_SECRET}));
};