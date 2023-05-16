import {Router} from 'express'
import { createHash, isValidPassword } from '../utils';
import { UserService } from "../repository/index.js";

const router = Router()
export const uploaddocuments = async (req, res) =>{
    const uid = req.params.uid
    console.log(req.files);
    const user = await UserService.get(req.user.user._id)
    req.user.user.documents = user.documents
    console.log(req.user.user);
    if(!req.files){
        return res.status(400).send({status:'error',error:'no file'})
    }
    if (!req.user.user?.documents) {
        req.user.user.documents = []
    } 
    for (let index = 0; index < req.files.length; index++) {
        req.user.user.documents.push({name: req.files[index].fieldname, reference:req.files[index].path})
    }
    console.log(req.user.user);
    const result = await UserService.update(uid, req.user.user)
    res.send({result, message:'file uploaded'})
}
export default router;