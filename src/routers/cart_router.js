import { Router } from "express";
import CartManager from "../dao/manager/cart_manager.js";
import cartModel from "../dao/models/cart_model.js";
const cartManager=new CartManager('carts.json')
const router=Router()

router.get("/", async (req, res) => {
    const carts = await cartModel.find().lean().exec()
    res.json({ carts })
})
router.post('/',async(req,res)=>{
    const newCart = await cartModel.create({products:{}})
    res.json({status:'success',newCart})
})

router.get('/:id', async(req,res)=>{
    const id= parseInt (req.params.id)
    const cart= await cartModel.findOne({_id:id})
    if(cart === -1) return res.status(404).send('Carrito no encontrado!')
    res.json({cart})
})

router.post('/:cid/product/:pid',async(req, res)=>{
    const cartID = parseInt (req.params.cid)
    const productID = parseInt (req.params.pid)
    const cart = await cartManager.addProduct(cartID,productID)
    // if (!product) return res.status(404).send('Product not found')
    // for (const key of Object.keys(productToUpdate)) {
    //     product[key] = productToUpdate [key]
    // }
    // await cartManager.update(id,product)
    res.json({status:'success', cart})
})
export default router
