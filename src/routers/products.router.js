import { Router } from "express";
import FileManager from "../manager/file_manager.js";
const fileManager=new FileManager('products.json')
const router=Router()

//products/?limit=x
router.get('/', async (req, res) => {
    const products = await fileManager.get()
        const limit = req.query.limit
        //Si existe limit, limitar los productos al numero dado
        if (limit) products.splice(limit, products.length)
        req.io.emit('updatedProducts', await fileManager.get());
        res.json({products})
})
// router.get('/:pid', async(req,res)=>{
//     const id= parseInt (req.params.pid)
//     const products= await fileManager.geById(id)
//      if(products === -1) return res.status(404).send('Producto no existe!')
//     res.json({products})
// })
router.post('/',async(req,res)=>{
    const product = req.body
    const productAdded = await fileManager.add(product)
    if(productAdded === -1) return res.status(404).send('Producto no existe!')
    req.io.emit('updatedProducts', await fileManager.get());
    res.json({status: 'success', productAdded})
})
router.put('/:pid',async(req, res)=>{
    const id = parseInt(req.params.pid)
    const productToUpdate = req.body
    const product = await fileManager.geById(parseInt(id))
    if(product === -1) return res.status(404).send('Producto no existe!')
    for (const key of Object.keys(productToUpdate)) {
        product[key] = productToUpdate [key]
    }
    await fileManager.update(id,product)
    req.io.emit('updatedProducts', await fileManager.get());
    res.json({status:'success', product})
})
// se elimino el producto 1 a modo de ejemplo
router.delete('/:pid', async(req,res)=>{
    const id=parseInt(req.params.pid)
    const products= await fileManager.delete(id)
    if(products === -1) return res.status(404).send('Producto no existe!')
    req.io.emit('updatedProducts', await fileManager.get());
    res.json({status: 'success',products})
})
router.get('/home', async (req, res) =>{
    const products = await fileManager.get()
    res.render('home',
    {
        title: "Lista de Productos",
        products: products
    })
})

router.get('/realtimeproducts', async (req, res) =>{
    const products = await fileManager.get()
    res.render('realTimeProducts',
    {
        title: "Lista de Productos",
        products: products
    })
})
export default router
