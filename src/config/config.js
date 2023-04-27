import dotenv from 'dotenv'
import { Command } from 'commander'
const program = new Command()
program.parse()
program
    .option('-d <dao>', 'DAO Mode', 'MONGO')
dotenv.config()
export default {
    DAO_MODE: program.opts().d,
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
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