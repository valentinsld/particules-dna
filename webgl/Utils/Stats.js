import StatsJs from 'stats.js'

export default class Stats {
  constructor(_active) {
    this.instance = new StatsJs()
    this.instance.showPanel(0)

    this.active = false

    if (_active) {
      this.activate()
    }
  }

  activate() {
    this.active = true

    document.body.appendChild(this.instance.dom)
  }

  deactivate() {
    this.active = false

    document.body.removeChild(this.instance.dom)
  }

  setRenderPanel(num) {
    this.instance.showPanel(num)
  }

  beforeRender() {
    if (!this.active) {
      return
    }

    this.instance.begin()
  }

  afterRender() {
    if (!this.active) {
      return
    }

    this.instance.end()
  }

  update() {
    if (!this.active) {
      return
    }

    this.instance.update()
  }

  destroy() {
    this.deactivate()
  }
}
