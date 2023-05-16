import passport from "passport";
import local from "passport-local"
import { UserService, CartService } from "../repository/index.js";
import GitHubStrategy from "passport-github2"
import jwt from 'passport-jwt'
import { createHash, isValidPassword,generateToken,extractCookie } from "../utils.js"
import config from "./config.js";

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
const cookieExtractor = req => {
    const token = req?.cookies['auth'] || req?.headers?.auth || null;
    req.logger.info('Cookie Extractor '+ token);
    return token;
}
const initializePassport = () => {
    passport.use('current',  new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwtPrivateKey // DEBE SER LA MISMA que como la del JWT UTILS 
    },async (jwt_payload, done)=>{
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
        
    }))

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age } = req.body
            const user = await UserService.getOneByEmail(username)
            if(user) {
                req.logger.info("User already exits");
                return done(null, false)
            }
            const userTemplate = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: await fetch('http://127.0.0.1:8080/api/carts', {method:'POST'}).then(res=>res.json()).then(data=> data._id),
                documents: [],
                last_connection: new Date()
            }
            const newUser = await UserService.create(userTemplate)
            return done(null, newUser)
    }))
    
    //Inicio con gitHub
    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.6efbd44c6d669031",
        clientSecret: "934d4dbd6174715b7c5c9a7eceef822111ca4ec0",
        callbackURL: "http://127.0.0.1:8080/session/githubcallback"
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            const user = await UserService.get({email: profile._json.email})
            if (user) {
                const token = generateToken(user)
                user.token = token
                return done(null, user);
            }
            const userTemplate ={
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                age: profile._json.age,
                password: "",
                cart: await fetch('http://127.0.0.1:8080/api/carts', {method:'POST'}).then(res=>res.json()).then(data=> data._id),
                documents: [],
                last_connection: new Date()
            }
            const newUser = await UserService.create(userTemplate)
            const token = generateToken(newUser)
            newUser.token = token
            return done(null, newUser)
        } catch (error) {
            return done('Error to login with GitHub: ',error)
            
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            if(username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                const admin = {
                    _id: '63e4ee6a795025c3ccb9b29a',
                    email: username,
                    password,
                    first_name: 'Admin',
                    last_name: 'Coder',
                    age: 100,
                    role: 'admin'
                }
                return done(null, admin)
            }
            const user = await UserService.getOneByEmail(username)
            if(!user) {
                console.log("User dont exist");
                return done(null, false)
            }
            if(!isValidPassword(user, password)) return done(null, false)
            const token = generateToken(user)
            user.token = token
            user.last_connection = new Date()
            await UserService.update(user._id, {last_connection: user.last_connection})
            return done(null, user)
        } catch (error) {
            console.log("error poder")
        }
    }))

    //JWT
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
        secretOrKey:config.jwtPrivateKey
    }, async(jwt_payload, done) => {
        done(null, jwt_payload)
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    
    passport.deserializeUser(async (id, done) => {
        const user = await UserService.getOneByID(id)
        done(null, user)
    })
}

export default initializePassport;