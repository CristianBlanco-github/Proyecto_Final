import dotenv from 'dotenv'
import { Command } from 'commander'
const program = new Command()
program
    .option('-d <dao>', 'DAO Mode', 'MONGO')
program.parse()
dotenv.config()
export default {
    DAO_MODE: program.opts().d,
    mongoURI: process.env.MONGO_URI,
    mongoDBName: process.env.MONGO_DB_NAME,
    PORT: process.env.PORT,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    jwtCookieName: process.env.JWT_COOKIE_NAME,
    ENVIRONMENT: process.env.ENVIRONMENT,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
}