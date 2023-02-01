import { Router } from "express";
import productModel from "../dao/models/products_model.js";
const router=Router()

//products/?limit
router.get('/', async (req, res) => {
    const products = await productModel.find().lean().exec()
        const limit = req.query.limit || 5
        //Si existe limit, limitar los productos al numero dado
        res.json(products.slice(0, parseInt(limit)))
})
// router.get('/:pid', async(req,res)=>{
//     const id= parseInt (req.params.pid)
//     const products= await fileManager.geById(id)
//      if(products === -1) return res.status(404).send('Producto no existe!')
//     res.json({products})
// })
router.post("/", async (req, res) => {
    try {
        const product = req.body
        if (!product.title) {
            return res.status(400).json({
                message: "Error Falta el nombre del producto"
            })
        }
        const productAdded = await productModel.create(product)
        req.io.emit('updatedProducts', await productModel.find().lean().exec());
        res.json({
            status: "Success",
            productAdded
        })
    } catch (error) {
        console.log(error)
        res.json({
            error
        })
    }
})
router.put('/:pid',async(req, res)=>{
    const id = parseInt(req.params.pid)
    const productToUpdate = req.body
    // const product = await productModel.geById(parseInt(id))
    // if(product === -1) return res.status(404).send('Producto no existe!')
    // for (const key of Object.keys(productToUpdate)) {
    //     product[key] = productToUpdate [key]
    // }
    const product= await productModel.updateOne({_id:id},productToUpdate)
    req.io.emit('updatedProducts', await productModel.find().lean().exec());
    res.json({status:'success', product})
})
// se elimino el producto 1 a modo de ejemplo
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid
    const productDeleted = await productModel.deleteOne({_id: id})
    req.io.emit('updatedProducts', await productModel.find().lean().exec());
    res.json({
        status: "Success",
        massage: "Product Deleted!",
        productDeleted
    })
})
// router.get('/home', async (req, res) =>{
//     const products = await fileManager.get()
//     res.render('home',
//     {
//         title: "Lista de Productos",
//         products: products
//     })
// })

router.get('/realtimeproducts', async (req, res) =>{
    const products = await productModel.find().lean().exec()
    res.render('realTimeProducts',
    {
        title: "Lista de Productos",
        products: products
    })
})
export default router
