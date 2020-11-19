import { Schema, Model, model } from 'mongoose'

export class Order extends Model {
}

export const OrderSchema = new Schema({
  table: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  orderNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PREPARING', 'DONE', 'CANCELED'],
    default: 'PENDING'
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export const orderModel = model('Order', OrderSchema)
