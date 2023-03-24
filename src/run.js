import productRouter from "./routers/products.router.js"
import cartRouter from "./routers/cart_router.js"
import chatRouter from "./routers/chat_router.js"
import productViewsRouter from './routers/products_views_router.js'
import sessionRouter from './routers/session_router.js'
import { passportCall } from "./utils.js";
import { MessageService } from "./repository/index.js"


const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })

    app.use("/session", sessionRouter)
    app.use("/products",passportCall("jwt"), productViewsRouter)
    app.use("/api/products", productRouter)
    app.use("/api/carts", cartRouter)
    app.use("/api/chat", chatRouter)

    let messages = []

    socketServer.on("connection", socket => {
        console.log("New client connected")
        socket.on("message", async data => {
        await MessageService.create(data)
        messages = await MessageService.get()
        socketServer.emit("logs", messages)
        })
    })
    app.use("/", (req, res) => res.send("HOME"))
}

export default run