import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import WebGL from './index.js'

export default class Renderer {
  constructor(_options = {}) {
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

    this.setInstance()
  }

  setInstance() {
    this.clearColor = '#001e26'

    // Renderer
    this.instance = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
    })
    this.instance.domElement.style.position = 'absolute'
    this.instance.domElement.style.top = 0
    this.instance.domElement.style.left = 0
    this.instance.domElement.style.width = '100%'
    this.instance.domElement.style.height = '100%'

    this.instance.setClearColor(this.clearColor, 1)
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)

    this.instance.physicallyCorrectLights = true
    // this.instance.gammaOutPut = true
    this.instance.outputEncoding = THREE.sRGBEncoding
    // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    // this.instance.shadowMap.enabled = false
    this.instance.toneMapping = THREE.NoToneMapping
    this.instance.toneMappingExposure = 1

    this.context = this.instance.getContext()

    // Debug
    if (this.debug) {
      this.debugFolder.addInput(this, 'clearColor').on('change', () => {
        this.instance.setClearColor(this.clearColor)
      })
    }
  }

  setPostProcess() {
    this.postProcess = {}

    /**
     * Render pass
     */
    this.postProcess.renderPass = new RenderPass(
      this.scene,
      this.camera.instance
    )

    /**
     * Effect composer
     */
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.sizes.width,
      this.sizes.height,
      {
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        encoding: THREE.sRGBEncoding,
        samples: 2,
      }
    )
    this.postProcess.composer = new EffectComposer(
      this.instance,
      this.renderTarget
    )
    this.postProcess.composer.setSize(this.sizes.width, this.sizes.height)
    this.postProcess.composer.setPixelRatio(this.sizes.pixelRatio)

    this.postProcess.composer.addPass(this.postProcess.renderPass)
  }

  resize() {
    // Instance
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)

    // Post process
    // this.postProcess.composer.setSize(this.sizes.width, this.sizes.height)
    // this.postProcess.composer.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    if (this.stats) {
      this.stats.beforeRender()
    }

    // if (this.usePostprocess) {
    //   this.postProcess.composer.render()
    // } else {
    this.instance.render(this.scene, this.camera.instance)
    // }

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
