import { WebGLRenderer, sRGBEncoding, NoToneMapping, Vector2 } from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import AberrationShader from './PostProcess/AberationShader.js'

import WebGL from './index.js'

export default class Renderer {
  constructor() {
    this.WebGL = new WebGL()
    this.debug = this.WebGL.debug
    this.stats = this.WebGL.stats
    this.sizes = this.WebGL.sizes
    this.scene = this.WebGL.scene
    this.camera = this.WebGL.camera

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder({ title: 'renderer' })
    }

    this.options = {
      renderPostProcess: true,
      clearColor: '#030303',
      exposure: 2,
      bloomStrength: 1.2,
      bloomThreshold: 0.2,
      bloomRadius: 2,
      afterImage: 0.65,
    }

    this.setInstance()
  }

  setInstance() {
    // Renderer
    this.instance = new WebGLRenderer({
      alpha: false,
      antialias: true,
      canvas: this.WebGL.canvas,
    })
    this.instance.domElement.style.position = 'absolute'
    this.instance.domElement.style.top = 0
    this.instance.domElement.style.left = 0
    this.instance.domElement.style.width = '100%'
    this.instance.domElement.style.height = '100%'

    this.instance.setClearColor(this.options.clearColor, 1)
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)

    this.instance.physicallyCorrectLights = true
    // this.instance.gammaOutPut = true
    this.instance.outputEncoding = sRGBEncoding
    // this.instance.shadowMap.type = PCFSoftShadowMap
    // this.instance.shadowMap.enabled = false
    this.instance.toneMapping = NoToneMapping
    this.instance.toneMappingExposure = 1

    this.context = this.instance.getContext()

    // Debug
    if (this.debug) {
      this.debugFolder.addInput(this.options, 'clearColor').on('change', () => {
        this.instance.setClearColor(this.options.clearColor)
      })
      this.debugFolder.addInput(this.options, 'renderPostProcess')
    }

    this.setPostProcess()
  }

  setPostProcess() {
    this.renderScene = new RenderPass(this.scene, this.camera.instance)

    this.bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    )
    this.bloomPass.threshold = this.options.bloomThreshold
    this.bloomPass.strength = this.options.bloomStrength
    this.bloomPass.radius = this.options.bloomRadius

    this.aberation = new ShaderPass(AberrationShader)

    this.composer = new EffectComposer(this.instance)
    this.composer.addPass(this.renderScene)
    this.composer.addPass(this.aberation)
    this.composer.addPass(this.bloomPass)

    if (!this.debug) return

    this.debugFolder
      .addInput(this.options, 'exposure', { min: 0.1, max: 2 })
      .on('change', (ev) => {
        this.instance.toneMappingExposure = Math.pow(ev.value, 4.0)
      })

    this.debugFolder
      .addInput(this.options, 'bloomThreshold', { min: 0.0, max: 1.0 })
      .on('change', (ev) => {
        this.bloomPass.threshold = Number(ev.value)
      })

    this.debugFolder
      .addInput(this.options, 'bloomStrength', { min: 0.0, max: 3.0 })
      .on('change', (ev) => {
        this.bloomPass.strength = Number(ev.value)
      })

    this.debugFolder
      .addInput(this.options, 'bloomRadius', { min: 0.0, max: 1.0 })
      .on('change', (ev) => {
        this.bloomPass.radius = Number(ev.value)
      })
  }

  resize() {
    // Instance
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)

    // Post process
    this.composer.setSize(this.sizes.width, this.sizes.height)
    this.composer.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    if (this.stats) {
      this.stats.beforeRender()
    }

    if (this.options.renderPostProcess) {
      this.composer.render(this.scene, this.camera.instance)
    } else {
      this.instance.render(this.scene, this.camera.instance)
    }

    if (this.stats) {
      this.stats.afterRender()
    }
  }

  destroy() {
    this.instance.renderLists.dispose()
    this.instance.dispose()
    this.renderTarget.dispose()
    // this.postProcess.composer.renderTarget1.dispose()
    // this.postProcess.composer.renderTarget2.dispose()
  }
}
