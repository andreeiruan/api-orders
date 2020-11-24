import { Order, orderModel } from '../../entities/Order'
import { IOrdersRepository, IOrdersAttributes } from '../IOrdersRespository'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import { IDbServices } from 'src/database/IDbServices'

config({ path: String(process.env.NODE_ENV).trim() === 'test' ? '.env.test' : '.env' })

export class OrdersRepository implements IOrdersRepository {
  readonly _dbServices : IDbServices

  constructor (dbServices: IDbServices) {
    this._dbServices = dbServices
  }

  validatedTypeId (id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id)
  }

  async findById (id: string): Promise<Order> {
    await this._dbServices.connect()
    const order = await orderModel.findById(id)
    await this._dbServices.disconnect()
    return order
  }

  async create (order: IOrdersAttributes): Promise<Order> {
    await this._dbServices.connect()
    const orderCreate = await orderModel.create(order)
    await this._dbServices.disconnect()
    return orderCreate
  }

  async list (): Promise<Order[]> {
    await this._dbServices.connect()
    const orders = await orderModel.find()
    await this._dbServices.disconnect()
    return orders
  }

  async updateStatus (id: string, status: string): Promise<Order> {
    await this._dbServices.connect()
    const order = await orderModel.findByIdAndUpdate({ _id: id }, { status }, { new: true })
    await this._dbServices.disconnect()
    return order
  }

  async update (id: string, order: IOrdersAttributes): Promise<Order> {
    await this._dbServices.connect()
    const orderUpdate = await orderModel.findByIdAndUpdate({ _id: id }, {
      order
    }, { new: true })
    await this._dbServices.disconnect()

    return orderUpdate
  }

  async drop (): Promise<void> {
    await this._dbServices.connect()
    await orderModel.collection.drop()
    await this._dbServices.disconnect()
  }
}
