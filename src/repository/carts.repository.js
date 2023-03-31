import CartDTO from '../dao/DTO/carts.dto.js'
// import CustomError from "../errors/custom_errors.js";
// import EErrors from "../errors/enums.js";
// import { generateNullError } from "../errors/info.js";
// import { ProductService, ticketsService } from "./index.js";

export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    get = async() => {
        return await this.dao.get()
    }

    create = async(data) => {
        const dataToInsert = new CartDTO(data)
        return await this.dao.create(dataToInsert)
    }

    getById = async (id) => {
        return await this.dao.getById(id)
    }

    getByIdLean = async (id) => {
        return await this.dao.getByIdLean(id)
    }
    // addProductToCart = async (cart, product) => {
    //     if (!cart) CustomError.createError({
    //       name: "Find cart error",
    //       cause: generateNullError("Cart"),
    //       message: "Error trying to find cart",
    //       code: EErrors.NULL_ERROR
    //     })
    //     if (!product) CustomError.createError({
    //       name: "Find product error",
    //       cause: generateNullError("Product"),
    //       message: "Error trying to find product",
    //       code: EErrors.NULL_ERROR
    //     })
    
    //     const productIndex = cart.products.findIndex((p) => p.product?.equals(product._id));
    //     if (productIndex === -1) {
    //       cart.products.push({ product: product._id, quantity: 1 });
    //       await this.updateCart(cart.id, cart)
    //     } else {
    //       cart.products[productIndex].quantity++;
    //       await this.updateCart(cart.id, cart)
    //     }
    //     return new CartDTO(cart)
    //   };
    
    //   purchase = async (cid, purchaser, ) => {
    //     const cart = await this.getCart(cid)
    //     if(cart.products.length === 0) throw new Error('El carrito está vacío')
    
    //     const cartProducts = await Promise.all(cart.products.map(async product => {
    //       const newObj = await ProductService.getProduct(product.product || product._id)
    //       newObj.quantity = product.quantity
    //       return newObj
    //     }))
        
    //     const outOfStock = cartProducts.filter(p => p.stock < p.quantity).map(p => ({product: p._id, quantity: p.quantity}))
    //     const available = cartProducts.filter(p => p.stock >= p.quantity)
    //     const amount = available.reduce((acc, product) => acc + product.price, 0)
        
    //     const ticket = available.length > 0 ? (await ticketsService.createTicket({ amount, purchaser })).toObject() : null
    //     available.forEach(async product => await ProductService.updateStock(product._id, product.quantity))
    //     await this.updateCart(cid, {products: outOfStock})
    
    //     return { outOfStock, ticket }
    //   }
    
}