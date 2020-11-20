export class NotFoundError extends Error {
  constructor (collection: string) {
    super(`Not found: ${collection}`)
    this.name = 'InvalidParamError'
  }
}
