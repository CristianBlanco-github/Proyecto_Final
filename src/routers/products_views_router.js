import {Router} from 'express'
import passport from "passport"
import { cartDetail, failLoginView, failRegisterView, getProductByIdView, getProductsView, homeView, loginView, realtimeProductsView, registerView, reminderView } from '../controllers/views.controller.js';
import { passportCall, authorization} from "../utils.js";


const router = Router()



router.get('/products', passportCall('current', {session:false, failureRedirect:'/sessions/login'}),authorization(['PUBLIC']), getProductsView)

router.get('/products/:pid',  passportCall('current', {session:false, failureRedirect:'/sessions/login'}),authorization(['PUBLIC']), getProductByIdView)

router.get('/home',  passportCall('current', {session:false, failureRedirect:'/sessions/login'}),authorization(['PUBLIC']), homeView)

router.get('/realtimeproducts',  passportCall('current', {session:false, failureRedirect:'/sessions/login'}),authorization(['PUBLIC']), realtimeProductsView)

router.get('/carts/:cid',  passportCall('current', {session:false, failureRedirect:'/sessions/login'}),authorization(['USER', 'ADMIN', 'PREMIUM']),  cartDetail)

router.get('/login', loginView)

router.get('/register', registerView)

router.get('/failregister', failRegisterView)

router.get('/faillogin', failLoginView)

router.get('/reminder', reminderView)

export default router;
