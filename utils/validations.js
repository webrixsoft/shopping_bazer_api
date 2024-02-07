const Joi = require('joi');

// Login Validation Schema
const loginSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).max(1024).required()
});


//support Validation
const supportSchema = Joi.object({
        title: Joi.string().required(),
        message_text: Joi.required(),
        type: Joi.string().required(),
        image_support: Joi.optional()


});

module.exports = {
        loginValidation: loginSchema,
        supportValidation: supportSchema,
};
