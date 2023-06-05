import CartModel from "./models/cart_model.js"

class CartMongo{

    get = async (id = '') => {
        if (!id) return await CartModel.find().lean().exec();
        return await CartModel.findOne({_id:id}).lean().exec()
    }
    
    create= async (cart) => {
        return await CartModel.create(cart)
    }
    
    update = async (cartId,productId,quantity, exists) => {
        if (exists == false) return await CartModel.updateOne({_id:cartId},{$push: {products: {product: productId, quantity: quantity}}});
        else return await CartModel.updateOne({_id: cartId, 'products.product':productId}, {$set: {'products.$.quantity': quantity}}); 
    }

    clean = async (cartId) => {
        return await CartModel.updateOne({_id:cartId},{products:[]});
    }

    delete = async (cartId, prodId) => {
        return await CartModel.updateOne({_id:cartId},{$pull: {products: {product: prodId}}});
    }

    replace = async (cartId, products)=>{
        return await CartModel.updateOne({_id:cartId},{products:products});
    }
}

export default CartMongo;