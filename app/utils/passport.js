const authModule = require('./../servises/auth')
    , userService = require('./../servises/user')
    , authConfig = require('./../configs/auth.json')
    , twitterConfig = require('./../configs/twitter.json')
    , _ = require('lodash')
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , TwitterStrategy = require('passport-twitter').Strategy;

module.exports.initialize = () => {

    _.each(authConfig.enabledStrategies, (strategyName) => {
        passportStrategiesHandlers[strategyName]();
    });
    return passport;
};

const localStrategyHandler = () => {
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        userService
            .findById(id)
            .then((user) => {
                console.log(user)
                done(null, user);
            })
            .catch((error) => {
                done(error);
            });
    });
    
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, authModule.login));
};

const twitterStrategyHandler = () => {
    passport.use(new TwitterStrategy({
            consumerKey: twitterConfig.consumerKey,
            consumerSecret: twitterConfig.consumerSecret,
            callbackURL: authConfig.afterLoginUrl
        },
        authModule.loginViaTwitter
    ));
};

const passportStrategiesHandlers = {
    "local": localStrategyHandler,
    "twitter": twitterStrategyHandler
};