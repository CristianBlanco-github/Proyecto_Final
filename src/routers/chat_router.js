import { Router } from "express"
import { authorization, passportCall } from "../utils.js"
import { get } from '../controllers/chat.controller.js';

const router = Router()

router.get('/', passportCall('current', {session:false, failureRedirect:'/views/login'}),authorization(['USER','PREMIUM']), get)

export default router