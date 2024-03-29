import {Router} from "express"
import { authorization, passportCall } from "../utils.js"
import { getProducts, getProductById, addProduct, updateProductById, deleteProduct, mockingProducts } from '../controllers/products.controller.js';


const router = Router()

router.get('/products', getProducts)

router.get('/products/:pid', getProductById)

router.get('/mockingproducts', mockingProducts)

router.post('/', passportCall('current', {session:false, failureRedirect:'/views/login'}),authorization(['ADMIN','PREMIUM']), addProduct)

router.put('/:pid', passportCall('current', {session:false, failureRedirect:'/views/login'}),authorization(['ADMIN','PREMIUM']), updateProductById)

router.delete('/:pid', passportCall('current', {session:false, failureRedirect:'/views/login'}),authorization(['ADMIN','PREMIUM']), deleteProduct)

export default router;