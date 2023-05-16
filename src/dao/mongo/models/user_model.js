import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin','premium'],
        default: 'user'
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    documents: {
        type:[
            {
                name: String,
                reference: String
            }
            ],
        default: []
    },
    last_connection: Date
})
mongoose.set("strictQuery", false)
const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel