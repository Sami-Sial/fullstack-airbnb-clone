const joi = require("joi");


const joiListingValidationSchema = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.object({
                url: joi.string().required,
                filepath: joi.string().required()
        }),   // allow("", null),
        geometry: joi.array().items(
                joi.string().required(),
                joi.array().items(
                        joi.number().required(),
                        joi.number().required(),
                ).required()
        ).required(),
        owner: joi.string().required(),
        reviews: joi.array().items(joi.string()),
}).required();


const joiReviewValidationSchema = joi.object({
        rating: joi.number().required(),
        comment: joi.string().required
}).required();


const joiUserValidationSchema = joi.object({
        username: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
}).required();


module.exports = {
        joiListingValidationSchema,
        joiReviewValidationSchema,
        joiUserValidationSchema,
};
