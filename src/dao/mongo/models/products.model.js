import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productCollection = "products"

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: Number,
    status: {
        type: Boolean,
        default: true
    },
    stock: Number,
    category: String,
    thumbnails: {
        type: Array, 
        default:[]
    },
    owner: {
        type: String,
        default: "admin"
    }
})

productSchema.plugin(mongoosePaginate)
const ProductModel = mongoose.model(productCollection, productSchema)

export default ProductModel