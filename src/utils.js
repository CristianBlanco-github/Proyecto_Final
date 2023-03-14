import {fileURLToPath} from 'url'
import { dirname } from 'path'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import passport from 'passport'
import { jwtCookieName, jwtPrivateKey } from './config/credentials.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

//JWT

export const generateToken = user => {
    const token = jwt.sign({user}, jwtPrivateKey, {expiresIn: "24h"})
    return token
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[jwtCookieName] : null
}

export const passportCall = (strategy) =>  {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info){
            if(err) return next(err)
            if(!user) return res.status(401).render("errors/base", {error: info.messages ? info.messages : info.toString()})

            req.user = user
            next()
        }) (req, res, next)
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        const user = req.user.user;
        if (!user) return res.status(401).send({ error: "Unauthorized" });
        if (user.role != role) return res.status(403).send({ error: 'No Permission' })
        next();
    }
}