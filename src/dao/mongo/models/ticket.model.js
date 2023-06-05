import mongoose from "mongoose";

const ticketCollection = "tickets"

const ticketSchema = new mongoose.Schema({
    code: { //auto
        type: Number,
        unique: true
        },
    purchaser: String,//Correo del comprador
    purchase_datetime: Date, //compra creado
    amount: Number,//T.Compra
    roducts: {
        type:[
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: Number
            }
            ]}
})

const TicketModel = mongoose.model(ticketCollection, ticketSchema)

export default TicketModel