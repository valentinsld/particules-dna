import { Clock } from 'three'

export default class Raf {
  static instance

  constructor() {
    if (Raf.instance) {
      return Raf.instance
    }
    Raf.instance = this

    this.clock = new Clock()
    this.updateElements = {}

    this.loop()
  }

  suscribe(name, func) {
    if (!name && !func) {
      return console.error('Need 2 parameters')
    }
    return (this.updateElements[name] = func)
  }

  unsuscribe(name) {
    if (this.updateElements[name]) {
      delete this.updateElements[name]
    }
  }

  clear() {
    this.updateElements = {}
  }

  loop() {
    this.elapsedTime = this.clock.getElapsedTime()

    for (const el in this.updateElements) {
      this.updateElements[el].call(null, this.elapsedTime)
    }

    window.requestAnimationFrame(this.loop.bind(this))
  }
}
