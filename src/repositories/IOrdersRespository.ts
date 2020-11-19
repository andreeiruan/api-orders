import { Order } from '../entities/Order'

export type OrderStatus = 'PENDING' | 'PREPARING' | 'DONE' | 'CANCELED'

export interface IOrdersAttributes{
  id?: string,
  table: number,
  description: string,
  orderNumber: number,
  status?: OrderStatus
}

export interface IOrdersRepository{
  create(order: IOrdersAttributes): Promise<Order>
  list(): Promise<Order[]>
  updateStatus(id: string, status: OrderStatus): Promise<Order>
  update(id: string, order: IOrdersAttributes): Promise<Order>
}
