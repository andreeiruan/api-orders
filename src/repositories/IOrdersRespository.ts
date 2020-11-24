import { IDbServices } from 'src/database/IDbServices'
import { Order } from '../entities/Order'

export type OrderStatus = 'PENDING' | 'PREPARING' | 'DONE' | 'CANCELED'

export interface IOrdersAttributes{
  id?: string,
  table: number,
  description: string,
  orderNumber: number,
  status?: string
}

export interface IOrdersRepository{
  _dbServices: IDbServices
  findById(id: string): Promise<Order>
  create(order: IOrdersAttributes): Promise<Order>
  list(): Promise<Order[]>
  updateStatus(id: string, status: string): Promise<Order>
  validatedTypeId(id: string): boolean
  update(id: string, order: IOrdersAttributes): Promise<Order>
  drop(): Promise<void>
}
