const userService = require('./../servises/user')
    , cryptoFacade = require('./../facades/crypto')
    , _ = require('lodash')
    , allModels = require('./../models/models_builder').models
    , accountSchema = require('./../models/account')
    , twitterProfileSchema = require('./../models/twitter_profile')
    , errorService = require('./errorHandlerService');

const isValidPassword = (password, cipherText, salt) => {
    const hash = cryptoFacade.hashSync(password, salt);
    return cipherText === hash;
};

const buildSessionData = (account, twitterProfile) => {
    let data = {};
    data.displayed = account.firstName && account.lastName ? account.firstName + " " + account.lastName : twitterProfile.profile.displayName;
    data.id = account.id;
    return data;
};

const service = {
    /**
     * That function is callback for passport local authorisation strategy
     * @param username {string}
     * @param password {string}
     * @param done
     */
    login: function (username, password, done) {
        let userModel = allModels[accountSchema.getSchemaName()];
        userModel
            .findOne({email: username, isActive: true})
            .exec((error, user) => {
                if (user === null) {
                    return done(null, false, {message: 'Incorrect username.'});
                }
                if (!isValidPassword(password, user.password, user.salt)) {
                    return done(null, false, {message: 'Incorrect password.'});
                }
                return done(null, user);
            })
            .catch((error) => {
                return done(error);
            });
    },
    /**
     * That function is callback for passport twitter authorisation strategy
     * @param token
     * @param tokenSecret
     * @param profile
     * @param done
     */
    loginViaTwitter: (token, tokenSecret, profile, done) => {
        const queue = {token: token};
        let twitterProfileModel = allModels[twitterProfileSchema.getSchemaName()];
        twitterProfileModel
            .findOne(queue)
            .populate('account') //TODO how remove hardcode?
            .exec((err, foundProfile) => {
                errorService.handleError(err, 500, "ER006", done);
                const callback = (newUser, newProfile) => {
                    done(null, buildSessionData(newUser, newProfile));
                };
                if (foundProfile === null) {
                    userService.createNewProfileAndAccount(token, tokenSecret, profile, callback, done);
                }
                else {
                    if (foundProfile.account) {
                        callback(foundProfile.account, foundProfile);
                    }
                    else {
                        userService.addAccountToTwitterProfile(foundProfile, callback, done);
                    }
                }
               
            });
    },
    
    /**
     * Function for check is authorised user or not
     * @param req
     * @param res
     * @param next
     */
    loggedIn: (req, res, next) => {
        if (req.user) {
            next();
        } else {
            next(errorService.new(401));
        }
    },
    
    loggedOut: (req) => {
        return new Promise((resolve, reject) => {
            try {
                req.logout();
                resolve();
            }
            catch (error) {
                reject(errorService.new(500, {code: "ER002", reason: error}));
            }
            
        });
    }
};
module.exports = service;