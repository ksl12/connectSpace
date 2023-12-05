import Joi from "joi"
import jwt from "jsonwebtoken"
import "dotenv/config"


export const registerValidation = async (req, res, next) => {
    const conditionRegister = Joi.object({
        username: Joi.string().required().min(3).max(50).trim().strict(),
        password: Joi.string().required().min(6).max(25)
        .regex(/[ -~]*[a-z][ -~]*/) // at least 1 lower-case
        .regex(/[ -~]*[A-Z][ -~]*/) // at least 1 upper-case
        .regex(/[ -~]*(?=[ -~])[^0-9a-zA-Z][ -~]*/) // basically: [ -~] && [^0-9a-zA-Z], at least 1 special character
        .regex(/[ -~]*[0-9][ -~]*/), // at least 1 number
        firstName: Joi.string().required().min(3).max(50).trim().strict(),
        lastName: Joi.string().required().min(3).max(50).trim().strict(),
        email: Joi.string().required().trim().strict().email({ minDomainSegments: 2, tlds: { allow: false } }),
        phoneNumber: Joi.string().pattern(/^\d{10}$/).required().messages({"string.pattern.base": "Phone number must have 10 digits."}),
        gender: Joi.number().integer().min(0).max(2).required(),
        dateOFBirth: Joi.date().max("now").required() // MM-DD-YYYY
    })
    try {
        await conditionRegister.validateAsync(req.body, {abortEarly: false})
        next()
    } catch (error) {
        res.status(422).json({
            errors: new Error(error).message
        })
    }
}

export const loginValidation = async (req, res, next) => {
    const conditionLogin = Joi.object({
        username: Joi.string().required().min(3).max(50).trim().strict(),
        password: Joi.string().required().min(6).max(25)
        .regex(/[ -~]*[a-z][ -~]*/) // at least 1 lower-case
        .regex(/[ -~]*[A-Z][ -~]*/) // at least 1 upper-case
        .regex(/[ -~]*(?=[ -~])[^0-9a-zA-Z][ -~]*/) // basically: [ -~] && [^0-9a-zA-Z], at least 1 special character
        .regex(/[ -~]*[0-9][ -~]*/), // at least 1 number
    })
    try {
        await conditionLogin.validateAsync(req.body, {abortEarly: false})
        next()
    } catch (error) {
        res.status(422).json({
            errors: new Error(error).message
        })
    }
}

export const authVerify = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if(!token){
            return res.status(401).json({ msg: "You are not authenticated" })
        }
        if (token === null || token == " ") {
            return res.status(401).json({ msg: "You are not authenticated" })
        }        
        if(token.startsWith("Bearer")) {
            token = token.split(" ")[1]
        }
        const verified = jwt.verify(token, process.env.ACCESS_KEY);
        if (!verified) {
            return res.status(403).json({ msg: "Token is not valid" });
        }
        next();
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}

