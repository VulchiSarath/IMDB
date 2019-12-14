const bcrypt = require('bcrypt'),
  saltRounds = 10,
  _ = require('lodash');

module.exports =  {

  async encryptPayload(payload) {
    try {
      return await bcrypt.hash(payload, saltRounds);
    } catch (error) {
      throw error;
    }
  },

  async hashCompare(password, encrypted_password) {
    try {
      await bcrypt.compare(password, encrypted_password);
    } catch (error) {
      throw error;
    }
  }
}
