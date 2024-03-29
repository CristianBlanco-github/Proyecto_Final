import { generateProducts } from "../utils.js";
import CustomError from "../errors/custom_errors.js";
import EnumErrors from "../errors/enums.js";
import { generateProductErrorInfo } from "../errors/info.js";

import { ProductService } from "../repository/index.js";

export const getProducts = async (req, res) => {
    let {limit, page, query, sort} = req.query
    const products = await ProductService.getProducts(limit, page, sort, query)
    req.io.emit('updatedProducts', products.payload);
    res.send(products)
}

export const getProductById = async (req, res) => {
    const id = req.params.pid
    const product = await ProductService.getProductById(id)
    res.send(product)
}

export const addProduct = async (req, res, next) => { // Se Agregó el try catch y el next, porque sino , no pasaba el custom error al errohandler y crasheaba la app 
    try{
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const ownerID = req.user.user.role == "admin" ? "admin" : req.user.user._id
    const addProduct = await ProductService.addProduct(title, description, price, code, stock, category, status, thumbnails, ownerID)
    req.io.emit('updatedProducts', await ProductService.getProducts());
    res.send(addProduct)
    }catch(err){
      next(err);
    }
}

export const updateProductById = async (req, res, next) => {// Se Agregó el try catch y el next, porque sino , no pasaba el custom error al errohandler y crasheaba la app 
    try {
        const id = req.params.pid
        const product = req.body
        const ownerID = req.user.user.role == "admin" ? "admin" : req.user.user._id
        const updateProduct = await ProductService.updateProductById(id, product, ownerID)
        req.io.emit('updatedProducts', await ProductService.getProducts());
        res.send(updateProduct) 
    } catch (err) {
        next(err);
    }
    
}

export const deleteProduct = async (req, res) => {
    const id = req.params.pid
    const ownerID = req.user.user.role == "admin" ? "admin" : req.user.user._id
    const deleteProduct =  await ProductService.deleteProductById(id, ownerID)
    req.io.emit('updatedProducts', await ProductService.getProducts());
    res.send(deleteProduct)
}

export const mockingProducts = async (req, res) => {
    const products=[]
    for (let i = 0; i < 100; i++) {
        products.push(generateProducts())
    }
    res.send({status:'success', payload: products})
}