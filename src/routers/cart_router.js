import { Router } from "express";
const router=Router()
import CartManager from "../dao/manager/cart_manager.js";
import cartModel from "../dao/models/cart_model.js";
const cartManager=new CartManager()


router.get("/", async (req, res) => {
    const carts = await cartModel.find().lean().exec()
    res.json({ carts })
})
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const selCart = await cartManager.getCartById(cartId)
        res.render('cart', selCart)
    } catch (error) {
        res.status(401).render('cart', {status: 'error', error: 'Not found'})
    }

})

router.delete("/:cid/product/:pid",async(req,res)=>{
    const cartID = req.params.cid
    const productID = req.params.pid
    const cart=await cartModel.findById(cartID)
    if(!cart)return res.status(404).json({status:"error",error:"Carrito no encontrado"})
    const productIDX=cart.products.findIndex(p=>p.id==productID)
    if(productIDX<=0)return res.status(404).json({status:"error",error:"Producto no encontrado en el carrito"})
    cart.products=cart.products.splice(productIDX,1)
    console.log(cart)
    await cart.save()
    res.json({status:"Succes",cart})
})
router.delete("/:cid", async (req, res) => {
    const cartID = req.params.cid
    const cart = await cartModel.findById(cartID)
    if(!cart) return res.status(404).json({status: "error", error: "Cart Not Found"})

    cart.products = []
    await cart.save()    

    res.json({status: "Success", cart})
})

router.post('/',async(req,res)=>{
    const newCart = await cartModel.create({products:{}})
    res.json({status:'success',newCart})
})

router.post("/:cid/product/:pid",async(req, res)=>{
    const cartID = req.params.cid
    const productID = req.params.pid
    const quantity= req.body.quantity||1
    const cart = await cartModel.findById(cartID)
    let found =false
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].id==productID) {
            cart.products[i].quantity++
            found=true
            break
        }
    }
    if (found==false) {
        cart.products.push({id:productID,quantity})
    }
    await cart.save()
    res.json({status:'success', cart})
})
//PUT
router.put("/:cid/product/:pid", async (req, res) => {
    const cartID = req.params.cid
    const productID = req.params.pid
    const newQuantity = req.body.quantity

    const cart = await cartModel.findById(cartID)
    if(!cart) return res.status(404).json({status: "error", error: "Cart Not Found"})

    const productIDX = cart.products.find(p => p.id == productID)
    productIDX.quantity = newQuantity

    await cart.save()

    res.json({status: "Success", cart})
})
router.put("/:cid", async (req, res) => {
    const cartID = req.params.cid
    const cartUpdate = req.body

    const cart = await cartModel.findById(cartID)
    if(!cart) return res.status(404).json({status: "error", error: "Cart Not Found"})

    cart.products = cartUpdate
    await cart.save()

    res.json({status: "Success", cart})
})
export default router
