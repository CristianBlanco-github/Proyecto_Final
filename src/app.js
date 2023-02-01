import express from 'express';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import mongoose from 'mongoose'
import run from './run.js'

//Init servers
const app=express()

//Config engine templates
app.use(express.json())
// app.use(express.urlencoded({extended: true}))// codifica en formato json
app.use(express.static(__dirname+'/public'))
app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')


mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "ecommerce"
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