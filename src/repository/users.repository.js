import UserDTO from '../dao/DTO/users.dto.js';
import { generateToken, verifyUser } from "../utils.js";
import Mail from "../modules/mails.js";
class UserRepository{

    constructor(dao){
        this.dao = dao;
        this.mail = new Mail();
    }

    get = async() => {
        return await this.dao.get()
    }

    getOneByID = async(id) => {
        return await this.dao.getOneByID(id)
    }

    getOneByEmail = async(email) => {
        return await this.dao.getOneByEmail(email)
    }

    create = async(data) => {
        const dataToInsert = new UserDTO(data)
        return await this.dao.create(dataToInsert)
    }
    update= async (id,updatedUser) => {
        return await this.dao.update(id,updatedUser)
    }   
    delete = async (id) => {
        return await this.dao.deleteOne(id)        
    }
    reminder = async(email)=>{
        const user = await this.dao.getOne({email: email})
        if (!user) {
            return {error:"No hay usuario con ese correo"}
        }
        const token = generateToken(user)
        let html = `<h1> Recupere su contraseña: </h1>
        <h2><a href="http://127.0.0.1:8080/sessions/recoverPass/${token}">Link de recuperación</a><h2>
        `
        
        //send email
        const result = this.mail.send(user, "Recupere su contraseña", html)
        return {message: "Correo enviado"}
    }
    recoverPass = async (token) => {
        const user = verifyUser(token)
        return user
    }
    Premium = async (uid) => {
        const user = await this.dao.getbyId(uid)
        const identificacion = user.documents.find(documento => documento.name === "identificacion");
        const comprobante = user.documents.find(documento => documento.name === "comprobanteDomicilio");
        const estado = user.documents.find(documento => documento.name === "estadoDeCuenta");
        if (user.role == 'premium'){
            user.role = 'user'
            await this.dao.update(user._id, {role: user.role})
           
        } else if (user.role == 'user'){
            if (identificacion && comprobante && estado){
                user.role = 'premium'
                await this.dao.update(user._id, {role: user.role})
            } else {
                return 'Missing Documents'
            }
        }
        console.log(user.role);
        return user 
    }
    

}

export default UserRepository