import productRouter from "./routers/products.router.js"
import cartRouter from "./routers/cart_router.js"
import chatRouter from "./routers/chat_router.js"
import messagesModel from "./dao/models/messages_model.js";
import homeproduct from './routers/home_product.js'
import realtime from './routers/real_time_products.js'
import productViewsRouter from './routers/products_views_router.js'
import sessionRouter from './routers/session_router.js'


const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })
// // Middleware
// function requireAuth(req, res, next) {
//     if(req.session?.user) {
//         return next()
//     } else {
//         return res.status(401).json({status: 'error', payload: 'not authenticated'})
//     }
// }
    app.use('/',homeproduct)
    app.use('/',realtime)
    app.use("/session", sessionRouter)
    app.use("/products", productViewsRouter)
    app.use("/api/products", productRouter)
    app.use("/api/carts", cartRouter)
    app.use("/api/chat", chatRouter)

    let messages = []

    socketServer.on("connection", socket => {
        console.log("New client connected")
        socket.on("message", async data => {
        await messagesModel.create(data)
        messages = await messagesModel.find().lean().exec()
        socketServer.emit("logs", messages)
        })
    })

    app.use("/", (req, res) => res.send("HOME"))

}

export default run