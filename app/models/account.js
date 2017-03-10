const Schema = require('mongoose').Schema;

module.exports = {
  getSchema: () => {
    return {
      email: {
        type: String,
        max: 60
      },
      password: {
        type: String,
        max: 16,
        min: 6
      },
      firstName: {
        type: String,
        max: 200,
        min: 1
      },
      lastName: {
        type: String,
        max: 200,
        min: 1
      },
      isActive: {
        type: Boolean,
        default: true
      },
      salt: {
        type: String
      },
      twitterProfile: {
        type: Schema.Types.ObjectId,
        ref: "twitter_profile",
        default: null,
        unique: false
      }
    }
  },
  getSchemaName: () => {
    return "account"
  }
};