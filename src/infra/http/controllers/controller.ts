/**
 * THIS IS A SKETCH
 */

abstract class Controller {
  abstract readonly path: string

  public handle(schema, data) {
    // Validation Logic here
    this.afterValidation()
  }

  protected abstract afterValidation(): void
}

class NewController extends Controller {
  readonly path: string = 'teste:1'

  protected afterValidation(): void {
    throw new Error('Method not implemented.')
  }
}

const c1 = new NewController()

const on = (event: string, callback: (p: any) => any) => {
  console.log(event)
  callback('')
}

const s = {}

on(c1.path, (d: any) => c1.handle(s, d))

abstract class Factory {
  private static map: Map<string, string> = new Map()
  static register(k: string, v: string) {
    this.map.set(k, v)
  }
  static get(k: string) {
    return this.map.get(k)
  }
  abstract procuce(): string
}

Factory.register('teste', 'Hello World')

class ConcreteFactory extends Factory {
  procuce(): string {
    throw new Error('Method not implemented.')
  }
}

console.log(ConcreteFactory.map)
