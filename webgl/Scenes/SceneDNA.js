import * as THREE from 'three'
import Raf from '../Utils/Raf.js'

const options = {
  PLANE_WIDTH: 1,
  PLANE_HEIGHT: 10,
  PLANE_SEGMENT: 10,
}
/* eslint-disable no-unused-vars */
const vertexShader = `
uniform float uSize;

varying vec3 vColor;

void main() {

  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  gl_PointSize = uSize * ( 300.0 / -mvPosition.z );

  gl_Position = projectionMatrix * mvPosition;

}
`

const fragmentShader = `
void main() {

  gl_FragColor = vec4( 1.0, 1.0, 0.0 , 1.0 );
}
`

export default class SceneDNA {
  static singleton

  constructor(webgl) {
    this.WebGL = webgl
    this.Raf = new Raf()
    this.scene = this.WebGL.scene

    this.init()
  }

  init() {
    this.instance = new THREE.Group()

    const plane = new THREE.PlaneBufferGeometry(
      options.PLANE_WIDTH,
      options.PLANE_HEIGHT,
      options.PLANE_WIDTH * options.PLANE_SEGMENT,
      options.PLANE_HEIGHT * options.PLANE_SEGMENT
    )

    const shader = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,

      uniforms: {
        uSize: { value: 0.5 },
      },
    })

    this.DNA = new THREE.Points(plane, shader)
    this.instance.add(this.DNA)
    this.scene.add(this.instance)
  }
}
