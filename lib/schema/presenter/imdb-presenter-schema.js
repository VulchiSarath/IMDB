'use strict';

const joi = require('joi');


const SignUpRequestSchema = joi.object({
  email_address: joi.string().email().required(),
  password: joi.string().required()
});


module.exports = {
  SignUpRequestSchema
};