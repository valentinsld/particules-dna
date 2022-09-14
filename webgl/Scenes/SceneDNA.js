import * as THREE from 'three'
import Raf from '../Utils/Raf.js'

const options = {
  PLANE_WIDTH: 1,
  PLANE_HEIGHT: 10,
  PLANE_SEGMENT: 50,
}
/* eslint-disable no-unused-vars */
const vertexShader = `
uniform float uSize;

attribute float aSize;
attribute vec3 aColor;

varying vec3 vColor;

void main() {
  // rotation
  float rotation = position.y;
  float new_x = position.x*cos(rotation) - position.z*sin(rotation);
  float new_z = position.z*cos(rotation) + position.x*sin(rotation);

  vec4 mvPosition = modelViewMatrix * vec4(new_x, position.y, new_z, 1.0 );

  gl_PointSize = uSize * aSize * ( 300.0 / -mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;

  vColor = aColor;
}
`

const fragmentShader = `
varying vec3 vColor;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  float alpha = 1.0 - smoothstep(0.0, 0.4, dist);

  gl_FragColor = vec4( vColor , alpha );
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
      size: 0.3,
      colorA: '#612574',
      colorB: '#293583',
      colorC: '#1954ec',
    }

    this.init()
  }

  init() {
    this.instance = new THREE.Group()

    // create plane
    const plane = new THREE.PlaneBufferGeometry(
      options.PLANE_WIDTH,
      options.PLANE_HEIGHT,
      options.PLANE_WIDTH * options.PLANE_SEGMENT,
      options.PLANE_HEIGHT * options.PLANE_SEGMENT
    )

    // create shader
    const shader = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,

      uniforms: {
        uSize: { value: this.options.size },
        uColor: { value: new THREE.Color(this.options.color) },
      },
    })

    // add random size & color
    const numberParticules = plane.attributes.position.array.length

    const sizeArray = new Float32Array(numberParticules / 3)
    const colorArray = new Float32Array(numberParticules)

    const colorA = new THREE.Color(this.options.colorA)
    const colorB = new THREE.Color(this.options.colorB)
    const colorC = new THREE.Color(this.options.colorC)
    for (let index = 0; index < numberParticules / 3; index++) {
      sizeArray[index] = Math.random()

      const random = Math.random()
      const colorRandom =
        random > 0.66 ? colorA : random > 0.33 ? colorB : colorC
      colorArray[index * 3] = colorRandom.r
      colorArray[index * 3 + 1] = colorRandom.g
      colorArray[index * 3 + 2] = colorRandom.b
    }

    plane.setAttribute('aSize', new THREE.BufferAttribute(sizeArray, 1))
    plane.setAttribute('aColor', new THREE.BufferAttribute(colorArray, 3))

    this.DNA = new THREE.Points(plane, shader)
    this.DNA.position.x = 1.1

    this.instance.add(this.DNA)
    this.scene.add(this.instance)
  }
}
