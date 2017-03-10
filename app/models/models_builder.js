const account = require('./account')
    , twitterProfile = require('./twitter_profile')
    , mongoose = require('mongoose')
    , _ = require('lodash');

let models = {};

module.exports = {
    getAllSchemas: () => {
        const schemas = {};
        schemas[twitterProfile.getSchemaName()] = twitterProfile.getSchema();
    
        schemas[account.getSchemaName()] = account.getSchema();
        return schemas;
    },
    addModelsToDB(db) {
        return new Promise((resolve, reject) => {
            const schemas = this.getAllSchemas();
            _.each(schemas, (schema, name) => {
                models[name] = db.model(name, new mongoose.Schema(schema));
            });
            resolve()
        })
    },
    models: models
};