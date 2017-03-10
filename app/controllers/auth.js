const authService = require('./../servises/auth')
    , userService = require('./../servises/user')
    , logger = require('./../utils/logger')
    , errorService = require('./../utils/mongoose');

module.exports = {
    login: (req, res) => {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.send(req.user).status(200);
    },
    afterTwitterLogin: (req, res) => {
        res.send(req.user).status(200);
    },
    registration: (req, res, next) => {
        userService.registration(req.body)
            .then((result) => {
                res.send({success: true}).status(200);
            })
            .catch((error) => {
                next(error);
            })
    },
    logout: (req, res, next) => {
        authService.loggedOut(req)
            .then(() => {
                res.send({success: true}).status(200);
            })
            .catch((error) => {
                next(error);
            })
    },
    deleteAccount: (req, res, next) => {
        userService.deleteAccount(req.user)
            .then((result) => {
                res.send({success: true}).status(200);
            })
            .catch((error) => {
                next(error);
        })
    }
};