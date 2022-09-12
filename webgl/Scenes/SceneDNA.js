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
  // rotation
  float rotation = position.y;
  float new_x = position.x*cos(rotation) - position.z*sin(rotation);
  float new_z = position.z*cos(rotation) + position.x*sin(rotation);

  vec4 mvPosition = modelViewMatrix * vec4(new_x, position.y, new_z, 1.0 );

  gl_PointSize = uSize * ( 300.0 / -mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentShader = `
uniform vec3 uColor;

void main() {
  gl_FragColor = vec4( uColor , 1.0 );
}
`

export default class SceneDNA {
  static singleton

  constructor(webgl) {
    this.WebGL = webgl
    this.Raf = new Raf()
    this.scene = this.WebGL.scene
    this.debug = this.WebGL.debug

    this.options = {
      color: '#060a16',
    }

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
        uColor: { value: new THREE.Color(this.options.color) },
      },
    })

    if (this.debug) {
      const folder = this.debug.addFolder({ title: 'DNA' })

      folder.addInput(this.options, 'color').on('change', (v) => {
        shader.uniforms.uColor.value = new THREE.Color(v.value)
        console.log(shader.uniforms.uColor.value, v)
      })
    }

    this.DNA = new THREE.Points(plane, shader)
    this.instance.add(this.DNA)
    this.scene.add(this.instance)
  }
}
