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
        res.json({products})
})
router.get('/:id', async(req,res)=>{
    const id= parseInt (req.params.id)
    const products= await fileManager.geById(id)
    if(products === -1) return res.status(404).send('Producto no existe!')
    res.json({products})
})
router.post('/',async(req,res)=>{
    const product = req.body
    const productAdded = await fileManager.add(product)
    if(productAdded === -1) return res.status(400).send('Ya existe un producto con este código!')
    if(productAdded === -2) return res.status(400).send('Campos inválidos o faltantes!')
    res.json({status: 'success', productAdded})
})
router.put('/:pid',async(req, res)=>{
    const id = req.params.pid
    const productToUpdate = req.body
    const product = await fileManager.geById(parseInt(id))
    if (!product) return res.status(404).send('Producto no existe!')
    for (const key of Object.keys(productToUpdate)) {
        product[key] = productToUpdate [key]
    }
    await fileManager.update(id,product)
    res.json({status:'success', product})
})
// se elimino el producto 1 a modo de ejemplo
router.delete('/:id', async(req,res)=>{
    const id= (req.params.id)
    const products= await fileManager.delete(id)
    if(products === -1) return res.status(404).send('Producto no existe!')
    res.json({status: 'success',products})
})
export default router
