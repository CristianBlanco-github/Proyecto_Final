import express from 'express';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import mongoose from 'mongoose'
import run from './run.js'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initializePassport from "./config/passport.config.js";
import passport from "passport";

//Init servers
const app=express()

//Config engine templates
app.use(express.json())
app.use(express.urlencoded({extended: true}))// codifica en formato json
app.use(express.static(__dirname+'/public'))
app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

const MONGO_URI= "mongodb+srv://cristian:rheO0OsoktBDF5fp@cluster0.bqge7dg.mongodb.net/?retryWrites=true&w=majority"
const DB_NAME="ecommerce"
// Configurar sessions
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        dbName: DB_NAME
    }),
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())
mongoose.set('strictQuery',true)
mongoose.connect(MONGO_URI, {
    dbName: DB_NAME
}, (error) => {
    if(error){
        console.log("DB No conectado...")
        return
    }
    const httpServer = app.listen(8080, () => console.log("Empezando..."))
    const socketServer = new Server(httpServer)
    httpServer.on("error", () => console.log("ERROR"))
    run(socketServer, app)
})
// app.use((req,res,next)=>{
//     req.io=socketServer
//     next()
// })


// socketServer.on('connection',socket=>{
//     console.log(socket.id);
//     socket.on('msg_front',message=>console.log(message))
//     socket.emit('msg_back',"Conectando al servicio,Bienvenido desde el Back")
// })