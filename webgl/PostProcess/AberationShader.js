const AberrationShader = {
  uniforms: {
    tDiffuse: {
      value: null,
    },
    distort: {
      value: 0.1,
    },
    time: {
      value: 0,
    },
  },
  vertexShader:
    'varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}',
  fragmentShader:
    'uniform sampler2D tDiffuse;\n\tuniform float distort;\n\tuniform float time;\n\tvarying vec2 vUv;\n\n\n\tconst float max_distort = 0.5;\n\tconst int num_iter = 12;\n\tconst float reci_num_iter_f = 1.0 / float(num_iter);\n\n\t// chromatic aberration\n\tvec2 barrelDistortion(vec2 coord, float amt) {\n\tvec2 cc = coord - 0.5;\n\tfloat dist = dot(cc, cc);\n\treturn coord + cc * dist * amt;\n\t}\n\n\tfloat sat( float t )\n\t{\n\treturn clamp( t, 0.0, 1.0 );\n\t}\n\n\tfloat linterp( float t ) {\n\treturn sat( 1.0 - abs( 2.0*t - 1.0 ) );\n\t}\n\n\tfloat remap( float t, float a, float b ) {\n\treturn sat( (t - a) / (b - a) );\n\t}\n\n\tvec4 spectrum_offset( float t ) {\n\tvec4 ret;\n\tfloat lo = step(t,0.5);\n\tfloat hi = 1.0-lo;\n\tfloat w = linterp( remap( t, 1.0/6.0, 5.0/6.0 ) );\n\tret = vec4(lo,1.0,hi, 1.) * vec4(1.0-w, w, 1.0-w, 1.);\n\n\treturn pow( ret, vec4(1.0/2.2) );\n\t}\n\n\n\n\tvoid main() { \n\tvec2 zUV = (vUv - vec2(0.5))*0.95 + vec2(0.5);\n\tvec4 sumcol = vec4(0.0);\n\tvec4 sumw = vec4(0.0);  \n\tfor ( int i=0; i<num_iter;++i )\n\t{\n\t\tfloat t = float(i) * reci_num_iter_f;\n\t\tvec4 w = spectrum_offset( t );\n\t\tsumw += w;\n\t\tsumcol += w * texture2D( tDiffuse, barrelDistortion(zUV, .2 * max_distort*t ) );\n\t}\n\n\tvec4 color = sumcol / sumw;\n\n\tgl_FragColor = color;\n\t}',
}

export default AberrationShader
