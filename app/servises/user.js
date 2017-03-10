const cryptoFacade = require('./../facades/crypto')
    , _ = require('lodash')
    , allModels = require('./../models/models_builder').models
    , accountSchema = require('./../models/account')
    , twitterProfileSchema = require('./../models/twitter_profile')
    , Types = require('mongoose').Types
    , errorService = require('./errorHandlerService');


const isPasswordEqualPasswordConfirm = (body) => {
    return body.password === body.passwordConfirm
};

const generateUser = (body) => {
    let newUser = new allModels[accountSchema.getSchemaName()](body);
    if (body.password) {
        newUser.salt = cryptoFacade.genSaltSync(16);
        newUser.password = cryptoFacade.hashSync(body.password, newUser.salt);
    }
    return newUser;
};

const generateTwitterProfile =(body) => {
    let twitterProfileModel = allModels[twitterProfileSchema.getSchemaName()];
    return new twitterProfileModel(body);
};

const findUserById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            let userModel = allModels[accountSchema.getSchemaName()];
            userModel.findById(id, (error, user) => {
                errorService.handleError(error, 500, "ER003", reject);
                return resolve(user);
            });
        }
        catch (err) {
            return reject(errorService.new(500, {code: "ER004", reason: err}));
        }
    });
};

module.exports = {

    findById: findUserById,
    
    createNewProfileAndAccount: (token, tokenSecret, profile, callback, done) => {
        try {
            let newProfile = generateTwitterProfile({
                _id: Types.ObjectId(),
                token: token,
                tokenSecret: tokenSecret,
                profile: profile
            });
            let newUser = generateUser({
                _id: Types.ObjectId(),
                twitterProfile: newProfile._id
            });
            newProfile.account = newUser._id;
       
            newProfile.save((newProfileSaveError) => {
                errorService.handleError(newProfileSaveError, 500, "ER007", done);
                newUser.save((newUserSaveError) => {
                    errorService.handleError(newUserSaveError, 500, "ER008", done);
                    callback(newUser, newProfile);
                });
            });
        } catch (err) {
            errorService.new(500, {code: "ER005", reason: err})
        }
    },
    
    addAccountToTwitterProfile: (foundProfile, callback, done) => {
        let newUser = generateUser({
            _id: Types.ObjectId(),
            twitterProfile: foundProfile._id
        });
        newUser.save((saveNewUserError) => {
            done(errorService.new(500, {code: "ER008", reason: saveNewUserError}));
            foundProfile.account = newUser._id;
            foundProfile.save((updateProfileError) => {
                errorService.handleError(updateProfileError, 500, "ER009", done);
                callback(newUser, foundProfile);
            });
        });
    },
    
    registration: (body) => {
        return new Promise( (resolve, reject) => {
            try {
                if (!isPasswordEqualPasswordConfirm(body)) {
                    return reject(errorService.new(400, {message: "Password not equal confirm password"}));
                }
                let newUser = generateUser(body);
                newUser.save((error) => {
                    errorService.handleError(error, 400, "ER010", reject);
                    return resolve(newUser);
                })
            } catch (err) {
                reject(errorService.new(500, {code: "ER011", reason: err}));
            }
        });
    },
    
    deleteAccount: (reqUser) => {
        return new Promise( (resolve, reject) => {
            findUserById(reqUser.id)
                .then((user) => {
                    if (user === null) {
                        return reject(errorService.new(500, {code: "ER015", reason: "user try logout, but he's id not exist in db"}))
                    }
                    user.isActive = false;
                    user.save((saveError) => {
                        errorService.handleError(saveError, 500, "ER012", reject);
                        return resolve();
                    });
                })
                .catch((err) => {
                    reject(err);
                })
        });
    },
};