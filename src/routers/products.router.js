import {Router} from "express"
import { ProductService } from "../repository/index.js"
import { generateProducts } from "../utils.js";


const router = Router()

//GET
router.get("/", async (req, res) => {
    const products = await ProductService.get()
    const limit = req.query.limit
    if (limit) {
        res.json(products.slice(0, parseInt(limit)))
    } else {
        res.render("home", {
            products
        })
    }
})

router.get("/realtimeproducts", async (req, res) => {
    const products = await ProductService.get()
    res.render('realTimeProducts', {
        data: products
    })
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const product = await ProductService.getById(id)
    res.render("productDetail", product)
})

router.get("/mockingproducts",async(req, res)=>{
    const products=[]
    for (let i = 0; i < 100; i++) {
        products.push(generateProducts())
    }
    res.send({status:'success', payload: products})
})

//DELETE
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid
    const ownerID = req.user.user.role == "admin" ? "admin" : req.user.user._id
    const deleteProduct =  await ProductService.deleteProductById(id, ownerID)
    req.io.emit('updatedProducts', await ProductService.getProducts());
    res.send(deleteProduct)
})

//POST
router.post("/", async (req, res, next )=> {
    try{
        const {title, description, price, thumbnails, code, stock, category, status} = req.body
        const ownerID = req.user.user.role == "admin" ? "admin" : req.user.user._id
        const addProduct = await ProductService.addProduct(title, description, price, code, stock, category, status, thumbnails, ownerID)
        req.io.emit('updatedProducts', await ProductService.getProducts());
        res.send(addProduct)
        }catch(err){
          next(err);
        }
    })

//PUT
router.put("/:pid", async (req, res,next) => {
    try{
        const {title, description, price, thumbnails, code, stock, category, status} = req.body
        const ownerID = req.user.user.role == "admin" ? "admin" : req.user.user._id
        const addProduct = await ProductService.addProduct(title, description, price, code, stock, category, status, thumbnails, ownerID)
        req.io.emit('updatedProducts', await ProductService.getProducts());
        res.send(addProduct)
        }catch(err){
          next(err);
        }
    })

export default router