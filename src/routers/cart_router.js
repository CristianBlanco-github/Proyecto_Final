import { Router } from "express"
import TicketModel from "../dao/mongo/models/ticket.model.js"
import { CartService, ProductService } from "../repository/index.js"
import { authorization, passportCall } from "../utils.js"
import { v4 as uuidv4 } from 'uuid';
import CustomError from ".././errors/custom_errors.js"
import EErros from ".././errors/enums.js"
import { generateCartErrorInfoStock } from "../errors/info.js";

const router = Router()

//GET
router.get("/", async (req, res) => {
    const carts = await CartService.getCarts()
    res.json({ carts })
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const cart = await CartService.getCartById(id)
    const productsInCart = cart.products
    res.render("cart", {productsInCart})
})

//POST USER
router.post("/", authorization('user'), async (req, res) => {
    const newCart = await CartService.addCart({})

    res.json({status: "Success", newCart})
})

router.post("/:cid/product/:pid",passportCall('jwt',{session:false, failureRedirect:'/views/login'}), authorization(['USER','ADMIN','PREMIUM']),async (req, res, next) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const ownerID = req.user.user.role == "admin" ? "admin" : req.user.user._id
        const newCart = await CartService.addProductById(cartId,productId,1, ownerID)
        if (newCart?.error) {
            res.status(410).send({status: 'error', message: newCart.error})
        }else{

            res.send({status: 'success', parameters: newCart.newCart, cart: newCart.cart})
        }
    } catch (error) {
        next(error)
        /* res.status(401).send({status: 'error', message: error}) */
    }
})

router.post("/:cid/purchase", passportCall('jwt',{session:false, failureRedirect:'/views/login'}), authorization(['USER','ADMIN','PREMIUM']), async (req, res) => {
    const cartID = req.params.cid
    const cart = await CartService.getCartById(cartID)
    let totalPrice = 0
    const noStock = []
    const comparation = cart.products
    await Promise.all(comparation.map( async p => {
        if(p.id.stock >= p.quantity){
            p.id.stock -= p.quantity;
            ProductService.update(p.id._id, p.id);
            totalPrice += p.id.price * p.quantity;
            const productIDX = comparation.findIndex(item => item.id._id == p.id._id)
            comparation.splice(productIDX, 1)
            await cart.save()
        } else {
            noStock.push({
                title: p.id.title,
                price: p.id.price,
                quantity: p.quantity
            })
        }
    }))
    if(totalPrice > 0)
    await TicketModel.create({
        purchaser : req.user.user.email,
        amount : totalPrice,
        code: uuidv4()
    })
    res.json({status: "Success"})
})

//DELETE ADMIN
router.delete("/:cid/product/:pid", authorization('admin'), async (req, res) => {
    const cartID = req.params.cid
    const productID = req.params.pid

    const cart = await CartService.getCartById(cartID)
    if(!cart) return res.status(404).json({status: "error", error: "Cart Not Found"})

    const productIDX = cart.products.findIndex(p => p.id._id == productID)

    if(productIDX < 0) return res.status(404).json({status: "error", error: "Product Not Found on Cart"})

    cart.products.splice(productIDX, 1)
    await cart.save()

    res.json({status: "Success", cart})
})

router.delete("/:cid", authorization('admin'), async (req, res) => {
    const cartID = req.params.cid
    const cart = await CartService.getCartById(cartID)
    if(!cart) return res.status(404).json({status: "error", error: "Cart Not Found"})

    cart.products = []
    await cart.save()    

    res.json({status: "Success", cart})
})

//PUT ADMIN
router.put("/:cid/product/:pid", authorization('admin'), async (req, res) => {
    const cartID = req.params.cid
    const productID = req.params.pid
    const newQuantity = req.body.quantity

    const cart = await CartService.getCartById(cartID)
    if(!cart) return res.status(404).json({status: "error", error: "Cart Not Found"})

    const productIDX = cart.products.find(p => p.id._id == productID)
    productIDX.quantity = newQuantity

    await cart.save()

    res.json({status: "Success", cart})
})

router.put("/:cid", authorization('admin'), async (req, res) => {
    const cartID = req.params.cid
    const cartUpdate = req.body

    const cart = await CartService.getCartById(cartID)
    if(!cart) return res.status(404).json({status: "error", error: "Cart Not Found"})

    cart.products = cartUpdate
    await cart.save()

    res.json({status: "Success", cart})
})


export default router