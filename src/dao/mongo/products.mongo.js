import ProductModel from "./models/products.model.js"

export default class Product {
    constructor() {}
    get = async(querySearch='', limit='', page='', sortChoosen='') => {
        return await ProductModel.paginate(querySearch,{limit: limit || 10, page: page || 1, sort:sortChoosen, lean : true});
    }

    getOne = async (id) => {
        return await ProductModel.findOne({_id:id}).lean().exec();  
    }
    getOther = async (other) => {
        return await ProductModel.findOne(other).lean().exec();        
    } 

    create = async (newProduct)=>{
        return await ProductModel.create(newProduct)        
    }

    getById = async (id) => {
        return await ProductModel.findOne({_id: id})    
    }

    delete = async (id) => {
        return await ProductModel.deleteOne({_id: id})
    }

    update = async (id, updatedProduct) => {
        return await ProductModel.updateOne({_id:id},{$set: updatedProduct})
    }
}