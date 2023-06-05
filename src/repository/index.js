import { ProductDAO, CartDAO, UserDAO, MessageDAO, TicketDAO } from '../dao/factory.js'

import ProductRepository from './products.repository.js'
import UserRepository from './users.repository.js'
import MessageRepository from './messages.repository.js'
import CartRepository from './carts.repository.js'
import TicketRepository from "./ticket.repository.js";

export const ProductService = new ProductRepository(new ProductDAO())
export const UserService = new UserRepository(new UserDAO())
export const MessageService = new MessageRepository(new MessageDAO())
export const CartService = new CartRepository(new CartDAO())
export const TicketService = new TicketRepository(new TicketDAO());