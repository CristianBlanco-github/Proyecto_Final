import passport from "passport";
import local from "passport-local"
import { UserService, CartService } from "../repository/index.js";
import GitHubStrategy from "passport-github2"
import jwt from 'passport-jwt'
import { createHash, isValidPassword,generateToken,extractCookie} from "../utils.js"
import config from "./config.js";

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age } = req.body
        try {
            const user = await UserService.getOneByEmail(username)
            if(user) {
                req.logger.info("User already exits");
                return done(null, false)
            }
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: await CartService.addCart({})
            }
            if(!first_name || !last_name || !email || !age){
                req.logger.error("Faltan Datos")
            }else{
                const result = await UserService.create(newUser)
                return done(null, result)
            }
        } catch (error) {
            return done("[LOCAL] Error al obtener user " + error)
        }


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
                cart: await CartService.addCart({}),
                role: "user",
                
            }
            
            return done(null, newUser)
        } catch (error) {
            return done('Error to login with github' + error)
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
            return done(null, user)
        } catch (error) {
            console.log("error")
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