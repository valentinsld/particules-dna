import * as THREE from 'three'
import { lerp } from '../Utils/Lerp.js'
import Raf from '../Utils/Raf.js'

const options = {
  PLANE_WIDTH: 1.25,
  PLANE_HEIGHT: 4,
  PLANE_SEGMENT: 50,
}
/* eslint-disable no-unused-vars */
const vertexShader = `
uniform float uTime;
uniform float uSize;

attribute float aSize;
attribute vec3 aColor;

varying vec3 vColor;
varying vec2 vUv;

//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  // rotation
  float rotation = position.y * 1.4;
  float new_x = position.x*cos(rotation) - position.z*sin(rotation);
  float new_z = position.z*cos(rotation) + position.x*sin(rotation);

  vec4 mvPosition = modelViewMatrix * vec4(new_x, position.y, new_z, 1.0 );
  float noise = 0.7 + snoise(vec3(uv * 1.4, uTime)) * 0.4;

  gl_PointSize = uSize * aSize * noise * ( 300.0 / -mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;

  vColor = aColor;
  vUv = uv;
}
`

const fragmentShader = `
varying vec3 vColor;
varying vec2 vUv;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  float alpha = 1.0 - smoothstep(0.0, 0.4, dist);

  // gradient bottom
  alpha *= smoothstep(0.2, 0.5, vUv.y) * 0.6;

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

    this.rotation = 0
    this.rotationTarget = 0

    this.init()

    this.Raf.suscribe('DNA', this.update.bind(this))
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
        uTime: { value: 0 },
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
    this.DNA.position.x = 1

    this.instance.add(this.DNA)
    this.scene.add(this.instance)
    this.scene.rotation.z = -0.16
  }

  update(time) {
    this.rotation = lerp(this.rotation, this.rotationTarget, 0.1)
    this.DNA.rotation.y = (time + this.rotation) * 0.3
    this.DNA.material.uniforms.uTime.value = time * 0.3
  }
}
