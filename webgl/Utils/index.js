import WebGL from '../index.js'

export function getPositionOutOfScreen(posZ = 0) {
  const WEBGL = new WebGL()
  const camera = WEBGL.camera.instance
  const cameraZ = camera.position.z
  const distance = cameraZ - posZ
  const aspect = window.innerWidth / window.innerHeight
  const vFov = (camera.fov * Math.PI) / 180
  const planeHeightAtDistance = 3 * Math.tan(vFov / 2) * distance
  const planeWidthAtDistance = planeHeightAtDistance * aspect

  return { x: planeWidthAtDistance, y: planeHeightAtDistance }
}
