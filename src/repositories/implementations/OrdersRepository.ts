import { Order, orderModel } from '../../entities/Order'
import { IOrdersRepository, IOrdersAttributes, OrderStatus } from '../IOrdersRespository'

export class OrdersRepository implements IOrdersRepository {
  async create (order: IOrdersAttributes): Promise<Order> {
    const orderCreate = await orderModel.create(order)
    return orderCreate
  }

  async list (): Promise<Order[]> {
    const orders = await orderModel.find()
    return orders
  }

  async updateStatus (id: string, status: OrderStatus): Promise<Order> {
    const order = await orderModel.findByIdAndUpdate({ _id: id }, { status }, { new: true })
    return order
  }

  async update (id: string, order: IOrdersAttributes): Promise<Order> {
    const orderUpdate = await orderModel.findByIdAndUpdate({ _id: id }, {
      order
    }, { new: true })

    return orderUpdate
  }
}
