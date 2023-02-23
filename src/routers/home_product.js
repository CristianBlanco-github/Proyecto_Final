import { Router } from "express";
import FileManager from "../dao/manager/file_manager.js";
const fileManager=new FileManager('products.json')
const router=Router()
router.get('/home', async (req, res) =>{
    const products = await fileManager.get()
    res.render('home',
    {
        title: "Lista de Productos",
        products: products
    })
})
export default router