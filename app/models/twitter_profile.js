"use strict";

const Schema = require('mongoose').Schema;

module.exports = {
    getSchema: () => {
    return {
        token: {
            type: String,
            unique: true
        },
        tokenSecret: {
            type: String,
            unique: true
        },
        profile: {
            type: Object,
            "default": null
        },
        account: {
            type: Schema.Types.ObjectId,
            ref: 'account',
            unique: false,
            "default": null
        }
    }
    },
    getSchemaName: () => {
        return "twitter_profile";
    }
};