import { Router } from "express";
import { generateProducts } from "../utils.js";
import CustomError from "../errors/custom_errors.js";
import EErrors from "../errors/enums.js";
import { generatePropertyError, generateCartErrorInfoStock } from "../errors/info.js";

const router = Router()
const products = []

router.get("/", (req, res) => {    
    for(let i = 0; i < 100; i++) {
        products.push(generateProducts())
    }
    
    res.json({status: "success", payload: products})
})

router.post('/', (req, res) => {
    const { id, title, author, description, lang, code, price, stock, status, categories, thumbnails } = req.body
    const duplicated = products.find(p => p.code === code)
    if( !title || !author || !code || !price || !stock || typeof(title) !== "string" || typeof(author) !== "string" || typeof(code) !== "string" || typeof(price) !== "number" || typeof(stock) !== "number" ) {
        CustomError.createError({
            name: "Product creation error",
            cause: generatePropertyError({title, author, code, price, stock}),
            message: "Error trying to create product",
            code: EErrors.INVALID_TYPES_ERROR
        })
    } else if(typeof(stock) !== "number" || stock < 0) {
        CustomError.createError({
            name: "Product creation error",
            cause: generateCartErrorInfoStock(stock),
            message: "Error trying to create product",
            code: EErrors.STOCK_ERROR
        })
    }

    const product = { id, title, author, description, lang, code, price, stock, status, categories, thumbnails}
    products.push(product)
    res.json({status: "success", payload: product})
})

export default router