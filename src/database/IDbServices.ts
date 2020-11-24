export interface IDbServices {
  connect(): Promise<void>
  disconnect(): Promise<void>
}
