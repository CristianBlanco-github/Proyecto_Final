import UserModel from "./models/user_model.js"

export default class User {
    constructor() {}

    get = async(username) => {
        return await UserModel.findOne({email: username}).lean().exec()
    }
    create = async (newUser)=>{
        return await UserModel.create(newUser)        
    }
    getAll = async () => {
        return await UserModel.find().lean().exec()
    }
    update= async (id,updatedUser) => {
        return await UserModel.updateOne({_id:id},{$set: updatedUser})
    }
    getOneByID = async(id) => {
        return await UserModel.findById(id).lean().exec()
    }
    getOne = async (parameter) => {
        return await UserModel.findOne(parameter).lean().exec()
    }
    getbyId = async (id) => {
        return await UserModel.findById(id).lean().exec()
    }
    delete = async (id) => {
        return await UserModel.deleteOne({_id:id})        
    }
    getOneByEmail = async(email) => {
        return await UserModel.findOne({ email }).lean().exec()
    }
    deleteMany = async (arrayOfId) => {
        return await usersModel.deleteMany({_id:{$in: arrayOfId}})        
    }
}