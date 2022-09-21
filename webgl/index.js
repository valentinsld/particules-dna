import { AxesHelper, Scene } from 'three'
import { Pane } from 'tweakpane'

import Sizes from './Utils/Sizes.js'
import Stats from './Utils/Stats.js'

import Renderer from './Renderer.js'
import Camera from './Camera.js'
import Raf from './Utils/Raf.js'
import EventEmitter from './Utils/EventEmitter.js'
import SceneDNA from './Scenes/SceneDNA.js'

export default class WebGL extends EventEmitter {
  static instance

  constructor() {
    super()

    if (WebGL.instance) {
      return WebGL.instance
    }
    WebGL.instance = this
    this.canvas = document.querySelector('#canvasWebgl')

    this.started = false

    this.sizes = new Sizes()
    this.raf = new Raf()
    this.setScene()
    this.setDebug()
    this.setCamera()
    this.setRenderer()

    this.sizes.on('resize', () => {
      this.resize()
    })

    this.raf.suscribe('webgl', this.update.bind(this))

    this.started = true
    this.trigger('endLoading')

    this.initDNA()
  }

  setDebug() {
    if (window.location.hash === '#debug') {
      this.debug = new Pane()
      this.stats = new Stats(true)

      const axesHelper = new AxesHelper(5)
      this.scene.add(axesHelper)
    }
  }

  setScene() {
    this.scene = new Scene()
  }

  setCamera() {
    this.camera = new Camera()
  }

  setRenderer() {
    this.renderer = new Renderer({ rendererInstance: this.rendererInstance })
  }

  initDNA() {
    this.DNA = new SceneDNA(this)
  }

  update() {
    if (this.stats) this.stats.update()

    this.camera.update()

    this.renderer.update()
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  destroy() {
    this.renderer.instance.domElement.remove()
    if (this.stats) this.stats.destroy()
    if (this.debug) this.debug.dispose()
  }
}
