import { Router } from "express";
import passport from "passport";
import config from "../config/config.js";
import { UserService } from "../repository/index.js";
import { authorization,passportCall,createHash,isValidPassword } from "../utils.js";
import { uploaddocuments } from '../controllers/session.controller.js';
import { uploader } from '../multer_utils.js';

const router = Router()

//Profile
router.get('/current', passportCall('jwt'), authorization('user'), async (req, res)=>{
    const userInfo = await UserService.getCurrent(req.user.user)
    delete userInfo.documents;
    res.send(userInfo)
})

//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API para crear usuarios en la DB
router.post('/register', passport.authenticate('register', { failureRedirect: '/session/failregister' }), async (req, res) => {
    res.redirect('/session/login')
})
router.get('/failregister', (req, res) => {
    req.logger.warning('Fail Strategy');
    res.send({ error: "Failed" })
})

// Vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login', {style: "/css/login.css"})
})

// API para login
router.post('/login', passport.authenticate('login', { failureRedirect: '/session/faillogin' }), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "Invalid credentiales" })
    }
    res.cookie(config.jwtCookieName, req.user.token).redirect('/views/products')
    
})
router.get('/faillogin', (req, res) => {
    req.logger.warning("Fail Login")
    res.send({error: "Fail Login"})
})

router.get('/profile', (req, res) => {
    res.json(req.session.user)
})

// Cerrar Session
router.get('/logout',async (req, res) => {
    await UserService.update(req.user.user._id, {last_connection: new Date()})
    res.clearCookie(config.jwtCookieName).redirect('/session/login');
})

//Para iniciar con GitHub
router.get(
    '/github',
    passport.authenticate('github', {scope: ['user:email']}),
    async(req, res) => {}
)

router.get(
    '/githubcallback',
    passport.authenticate('github', {failureRedirect: '/session/login'}),
    async(req, res) => {

        req.session.user = req.user
        res.redirect('/products')
    }
)
router.get('/reminder', async (req, res) =>{
    const { email } = req.body
    const result = await UserService.reminder(email)
    res.render('sessions/login',result)
})

router.get('/recoverPass/:token', async (req, res) =>{
    const token = req.params.token
    const result = await UserService.recoverPass(token)
    if (result) res.render('sessions/recoverPass',{token})
    else res.render('sessions/reminder')
})

router.get('/recoverPassAction/:token',async (req, res) =>{
    const token = req.params.token
    const {password} = req.body 
    const result = await UserService.recoverPass(token)
    if (!isValidPassword(result, password)) {
        result.password = createHash(password)
        console.log(result);
        const newUserPassword = await UserService.update(result._id, result)
        if (newUserPassword) res.render('sessions/login',{message:"Contraseña Cambiada"})
    } else {
        res.render('sessions/login',{error:"LA CONTRASEÑA DEBE SER DIFERENTE A LAS YA USADAS"})
    }
})

router.post('/premium/:uid', passportCall('jwt',{session:false, failureRedirect:'/views/login'}), authorization(['ADMIN']), async (req, res) =>{
    const uid = req.params.uid
    const result = await UserService.goPremium(uid)
    if (result == 'Missing Documents'){
        return res.send({error: "Faltan Documentos"})    
    }
    return res.send(result)
})

router.post('/:uid/documents', passportCall('current', {session:false, failureRedirect:'/views/login'}),authorization(['ADMIN','USER','PREMIUM']),uploader.any(), uploaddocuments)

export default router