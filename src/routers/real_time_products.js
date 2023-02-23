import { Router } from "express";
import FileManager from "../dao/manager/file_manager.js";
const fileManager=new FileManager('products.json')
const router=Router()
router.get('/realtimeproducts', async (req, res) =>{
    const products = await fileManager.get()
    res.render('realTimeProducts',
    {
        title: "Lista de Productos",
        products: products
    })
})
export default router
