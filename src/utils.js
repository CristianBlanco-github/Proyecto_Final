import {fileURLToPath} from 'url'
import { dirname } from 'path'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import passport from 'passport'
import config from './config/config.js'
import {faker} from "@faker-js/faker"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}
export const generateToken = user => {
    const token = jwt.sign({user}, config. jwtPrivateKey, {expiresIn: "1h"})
    return token
}
//JWT
export const authToken = (req,res,next)=>{
    const token = req.cookies[config.jwtCookieName]
    if(!token) return next()

    jwt.verify(token, config.jwtPrivateKey, (error, credentials)=>{
        req.user = credentials.user
        next()
    })

}
export const verifyUser = token => {
    let user;
    jwt.verify(token, config.jwtPrivateKey, (error, credentials)=>{
        user = credentials?.user
    })
    return user
}

export const passportCall = (strategy) =>  {
    return async(req, res, next)=>{
        passport.authenticate(strategy, (err, user, info)=>{
            if(err) return next(err);
            if (user) req.user = user;
            next();
        })(req, res, next)
    }
}

export const authorization = (policies) => {
    return async (req,res,next)=>{
        if (policies.includes('PUBLIC')) return next()
        if (policies.length>0){
            if (!req.user) return res.status(401).render('sessions/login',{error:'No hay Usuario logueado'});
            if (!policies.includes(req.user.user.role.toUpperCase())) return res.status(403).send({error:'Usuario sin permisos'});
            return next();
        }
    }
}

export const generateProducts = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        code: faker.random.alphaNumeric(4),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.random.numeric(),
        categories: [faker.commerce.productAdjective(), faker.commerce.productAdjective()],
        thumbnails: [faker.image.imageUrl()]
    }
}
