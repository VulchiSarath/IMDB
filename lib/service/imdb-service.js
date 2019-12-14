'use strict'

const BaseAppLoader = require('../../base-app-loader'),
  UserDBAccessor = require('../db-accessor/user-db-accessor'),
  Errors = require('../common/errors'),
  Success = require('../common/success'),
  Bcrypt = require('../common/helpers/bcrypt'),
  uuid = require('uuid');

class IMDbService extends BaseAppLoader {
  constructor(dependencies, config, requestContext) {
    super(dependencies, config, requestContext);
  }

  async signUp(payload) {
    const me = this;
    try {
      const userDBAccessor = new UserDBAccessor(me.dependencies, me.config);
      const options = { email_address: payload.email_address };
      const user = await userDBAccessor.filter(options);
      if( user.length > 0) {
        throw Errors.emailAlreadyExists;
      }
      const password_hash = await Bcrypt.encryptPayload(payload.password);
      delete payload.password;
      payload.password_hash = password_hash;
      payload._id = uuid.v4();
      await userDBAccessor.save(payload);
      return Success.userCreatedSuccessfully;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = IMDbService;
