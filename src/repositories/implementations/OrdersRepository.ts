import { Order, orderModel } from '../../entities/Order'
import { IOrdersRepository, IOrdersAttributes, OrderStatus } from '../IOrdersRespository'
import mongoose from 'mongoose'

import { config } from 'dotenv'
config({ path: String(process.env.NODE_ENV).trim() === 'test' ? '.env.test' : '.env' })

export class OrdersRepository implements IOrdersRepository {
  async connect (): Promise<void> {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
  }

  async disconnect (): Promise<void> {
    mongoose.disconnect()
  }

  async create (order: IOrdersAttributes): Promise<Order> {
    await this.connect()
    const orderCreate = await orderModel.create(order)
    await this.disconnect()
    return orderCreate
  }

  async list (): Promise<Order[]> {
    await this.connect()
    const orders = await orderModel.find()
    await this.disconnect()
    return orders
  }

  async updateStatus (id: string, status: OrderStatus): Promise<Order> {
    await this.connect()
    const order = await orderModel.findByIdAndUpdate({ _id: id }, { status }, { new: true })
    await this.disconnect()
    return order
  }

  async update (id: string, order: IOrdersAttributes): Promise<Order> {
    await this.connect()
    const orderUpdate = await orderModel.findByIdAndUpdate({ _id: id }, {
      order
    }, { new: true })
    await this.disconnect()

    return orderUpdate
  }

  async drop (): Promise<void> {
    await this.connect()
    await orderModel.collection.drop()
    await this.disconnect()
  }
}
