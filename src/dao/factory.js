import config from "../config/config.js";

export let ProductDAO
export let CartDAO
export let UserDAO
export let MessageDAO
export let TicketDAO

switch (config.DAO_MODE) {
    case 'FILE':
        console.log('FileSystem database');
        const { default: ProductManager } = await import('../dao/file/productmanager.js')
        const { default: MessageManager } = await import('../dao/mongo/messages_mongo.js')
        const { default: UserManager } = await import('../dao/mongo/users_mongo.js')
        const { default: CartManager } = await import('../dao/file/cart_manager.js')
        const { default : TicketManager } = await import('../dao/mongo/ticket.mongo.js')

        ProductDAO = ProductManager
        MessageDAO = MessageManager
        CartDAO = CartManager
        UserDAO = UserManager
        TicketDAO = TicketManager

        break;
    case 'MONGO':
        
        console.log('Mongo database');
        const { default: ProductMongo } = await import('../dao/mongo/products.mongo.js')
        const { default: MessageMongo } = await import('../dao/mongo/messages_mongo.js')
        const { default: UserMongo } = await import('../dao/mongo/users_mongo.js')
        const { default: CartMongo } = await import('../dao/mongo/carts_mongo.js')
        const { default : TicketMongo } = await import('../dao/mongo/ticket.mongo.js')

        ProductDAO = ProductMongo
        MessageDAO = MessageMongo
        CartDAO = CartMongo
        UserDAO = UserMongo
        TicketDAO = TicketMongo

        break;
    default:
        break;
}