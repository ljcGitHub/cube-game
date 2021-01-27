import { THREE } from 'common/libs'

class BoxPhysical {
  constructor(option) {
    this.isAABB = true
    this.position = this.center = new THREE.Vector3()
    this.rotation = new THREE.Vector3()
    this.setExtents(option)
    this.getUnityVector()
  }
  setExtents(option) {
    const { width = 1, height = 1, depth = 1 } = option
    this.extents = [width / 2, height / 2, depth / 2]
    this.getBoxInfo()
  }
  setPosition(ps) {
    this.position.copy(ps)
    this.center = this.position
    this.getBoxInfo()
  }
  setRotation(rotation) {
    if (rotation.x && rotation.y && rotation.z) this.isAABB = false
    this.rotation.set(rotation.x, rotation.y, rotation.z)
    this.unityVector = this.getUnityVector()
  }
  getUnityVector() {
    const { x, y, z } = this.rotation
    var s1 = Math.sin(x)
    var c1 = Math.cos(x)
    var s2 = Math.sin(y)
    var c2 = Math.cos(y)
    var s3 = Math.sin(z)
    var c3 = Math.cos(z)
    var vx = [c1 * c2, c1 * s2 * s3 - c3 * s1, s1 * s3 + c1 * c3 * s2]
    var vy = [c2 * s1, c1 * c3 + s1 * s2 * s3, c3 * s1 * s2 - c1 * s3]
    var vz = [-s2, c2 * s3, c2 * c3]
    return [
      new THREE.Vector3(vx[0], vy[0], vz[0]),
      new THREE.Vector3(vx[1], vy[1], vz[1]),
      new THREE.Vector3(vx[2], vy[2], vz[2])
    ]
  }
  getBoxInfo() {
    const { center, extents } = this
    this.max = {
      x: center.x + extents[0],
      y: center.y + extents[1],
      z: center.z + extents[2]
    }
    this.min = {
      x: center.x - extents[0],
      y: center.y - extents[1],
      z: center.z - extents[2]
    }
  }
}

export default BoxPhysical