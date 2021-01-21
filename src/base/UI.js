import { THREE, window } from 'common/libs'
import { setSize } from 'common/utils/ui-adapter'

const w = window.innerWidth
const h = window.innerHeight

class UI {
  constructor() {
    this.group = new THREE.Group()
    this.sceneOrtho = new THREE.Scene()
    this.cameraOrtho = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, - h / 2, 1, 10)
    this.cameraOrtho.position.set(0, 0, 1)
    this.group.lookAt(this.cameraOrtho.position)
    this.sceneOrtho.add(this.cameraOrtho)
    this.sceneOrtho.add(this.group)
  }
  rect(width = 10, height = 10, material) {
    const geometry = new THREE.PlaneBufferGeometry(setSize(width), setSize(height))
    if (!material) {
      material = new THREE.MeshBasicMaterial({
        color: 0xffffff
      })
      material.transparent = true
    }
    const plane = new THREE.Mesh(geometry, material)
    this.group.add(plane)
    return plane
  }
  clear(plane) {
    this.group.remove(plane)
  }
}
export default new UI()