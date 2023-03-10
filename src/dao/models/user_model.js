import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }

})

const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel