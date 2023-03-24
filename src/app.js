import express from 'express';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import mongoose from 'mongoose'
import run from './run.js'
import session from 'express-session';
//import MongoStore from 'connect-mongo';
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import passport from "passport";


// //Init servers
const app=express()

//Config engine templates
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))// codifica en formato json
app.use(express.static(__dirname+'/public'))
app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')


// Configurar sessions
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const httpServer = app.listen(8080, () => console.log("Listening..."))
    const socketServer = new Server(httpServer)
    httpServer.on("error", () => console.log("ERROR"))
    run(socketServer, app)
