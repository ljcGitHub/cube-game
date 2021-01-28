import { THREE } from 'common/libs'
import Game from 'base/Game'
import { physicalUpdate } from 'common/utils/physical'

const geometry = new THREE.BoxBufferGeometry(1, 1, 1)

class Scene {
  constructor() {
    this.objects = []
    this.boxs = []
    this.lastCollision = []
    Game.addScene(this)
  }
  update(step) {
    this.collisionCheck()
    this.objects.forEach(obj => {
      obj.updateRigidBody()
      obj.update(step)
    })
    this.updateBoxDebug()
  }
  render(dt) {
    this.objects.forEach(obj => obj.render(dt))
  }
  add(obj) {
    obj.content.forEach(obj => Game.scene.add(obj))
    this.objects.push(obj)
  }
  remove(obj) {
    obj.content.forEach(obj => Game.scene.remove(obj))
    this.objects = this.objects.filter(item => item !== obj)
  }
  collisionCheck() {
    const check = physicalUpdate(this.objects)
    this.objects.forEach((obj, index) => {
      if (obj.rigidBody) {
        const force = obj.rigidBody._force
        obj.position.x += force.x
        obj.position.y += force.y
        obj.position.z += force.z
        obj.positionChange = true
        obj.force = []
        obj.updateRigidBody()
      }
      obj.collision(check[index])
    })
  }
  showBoxDebug() {
    if (this.boxs.length) this.boxs.forEach(box => Game.scene.remove(box))
    this.objects.forEach((obj, index) => {
      if (obj.showBoxDebug && obj.rigidBody) {
        const b = obj.rigidBody
        const box = new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({ color: obj.boxColor, wireframe: false })
        )
        box.scale.set(b.extents[0] * 2, b.extents[1] * 2, b.extents[2] * 2)
        box.position.copy(b.position)
        box.rotation.set(b.rotation.x, b.rotation.y, b.rotation.z)
        obj.showBoxAxes && box.add(new THREE.AxesHelper(5))
        this.boxs[index] = box
        Game.scene.add(box)
      }
    })
  }
  updateBoxDebug() {
    if (Game.dev) {
      this.objects.forEach((obj, index) => {
        const box = this.boxs[index]
        if (box) {
          box.position.copy(obj.position)
          box.rotation.copy(obj.rotation)
        }
      })
    }
  }
  destroy() {
    this.objects.forEach(obj => obj.destroy())
    this.objects = null
    Game.removeScene(this)
  }
}

export default Scene