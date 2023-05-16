import {Router} from "express"
import { ProductService } from "../repository/index.js"
import { generateProducts } from "../utils.js";


const router = Router()

//GET
router.get("/products", async (req, res) => {
    let {limit, page, query, sort} = req.query
    const products = await ProductService.getProducts(limit, page, sort, query)
    req.io.emit('updatedProducts', products.payload);
    res.send(products)
})

router.get("/realtimeproducts", async (req, res) => {
    const products = await ProductService.getProducts()
    res.render('realTimeProducts', 
    {
        title: "Lista de Productos",
        products: products.payload,
        user: req.user?.user
    })
    
    setTimeout(()=>{
        req.io.emit('track','')
        console.log(req.io.allSockets()); 
    },1000)
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const product = await ProductService.getProductById(id)
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