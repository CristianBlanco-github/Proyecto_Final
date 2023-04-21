import dotenv from 'dotenv'

dotenv.config()
export default {
    BASE_URL: process.env.BASE_URL,
    persistence: process.env.PERSISTENCE,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    jwtCookieName: process.env.JWT_COOKIE_NAME,
    mongoURI: process.env.MONGO_URI,
    mongoDBName: process.env.MONGO_DB_NAME,
    ENVIRONMENT: process.env.ENVIRONMENT,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS
}