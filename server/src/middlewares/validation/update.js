import Joi from "joi"
import "dotenv/config"

export const updateUserValidation = async (req, res, next) => {
    const conditionUpdateUser = Joi.object({
        avatar: Joi.any(),
        firstName: Joi.string().required().min(3).max(50).trim().strict(),
        lastName: Joi.string().required().min(3).max(50).trim().strict(),
        email: Joi.string().required().trim().strict().email({ minDomainSegments: 2, tlds: { allow: false } }),
        phoneNumber: Joi.string().pattern(/^\d{10}$/).required().messages({"string.pattern.base": "Phone number must have 10 digits."}),
        gender: Joi.number().integer().min(0).max(2).required(),
        dateOFBirth: Joi.date().max("now").required() // MM-DD-YYYY
    })
    try {
        await conditionUpdateUser.validateAsync(req.body, {abortEarly: false})
        next()
    } catch (error) {
        res.status(422).json({
            errors: new Error(error).message
        })
    }
}