import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter {
  static instance

  constructor() {
    super()

    if (Sizes.instance) {
      return Sizes.instance
    }
    Sizes.instance = this

    // Resize event
    window.addEventListener('resize', this.resize.bind(this))

    this.resize()
  }

  /**
   * Resize
   */
  resize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.ratio = window.innerWidth / window.innerHeight
    this.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

    this.trigger('resize')
  }
}
