import express from 'express';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'

import productRouter from './routers/products.router.js'
import cartRouter from './routers/cart_router.js'

//Init servers
const app=express()
const httpserver = app.listen(8080,()=>console.log('Empezando....'))
const socketServer=new Server(httpserver)
// httpserver.on('error',()=>console.log('ERROR'))

//Config engine templates
app.use(express.json())
// app.use(express.urlencoded({extended: true}))// codifica en formato json
app.use(express.static(__dirname+'/public'))
app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')
app.use((req,res,next)=>{
    req.io=socketServer
    next()
})
app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)

socketServer.on('connection',socket=>{
    console.log(socket.id);
    socket.on('msg_front',message=>console.log(message))
    socket.emit('msg_back',"Conectando al servicio,Bienvenido desde el Back")
})