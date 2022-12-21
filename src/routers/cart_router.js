import { Router } from "express";
import CartManager from "../manager/cart_manager.js";
const cartManager=new CartManager('carts.json')
const router=Router()

router.post('/',async(req,res)=>{
    const newCart = await cartManager.create()
    res.send({status:'success',newCart})
})

router.get('/:id', async(req,res)=>{
    const id= parseInt (req.params.id)
    const cart= await cartManager.geById(id)
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
