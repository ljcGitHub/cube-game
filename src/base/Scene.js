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
    obj.content && Game.scene.add(obj.content)
    obj.addContent = content => Game.scene.add(content)
    obj.removeContent = content => Game.scene.remove(content)
    this.objects.push(obj)
  }
  remove(obj) {
    obj.addContent = null
    obj.removeContent = null
    obj.content && Game.scene.remove(obj.content)
    this.objects = this.objects.filter(item => item !== obj)
  }
  collisionCheck() {
    const bodyBoxs = []
    this.objects.forEach((obj, index) => {
      if (obj.rigidBody) {
        bodyBoxs.push(obj)
      }
    })
    physicalUpdate(bodyBoxs).forEach((obj, index) => {
      const force = obj.rigidBody.force
      const check = obj.check
      obj.position.x += force.x
      obj.position.y += force.y
      obj.position.z += force.z
      obj.positionChange = true
      obj.rigidBody.force = { x: 0, y: 0, z: 0 }
      obj.check = []
      obj.updateRigidBody()
      obj.collision(check)
    })
  }
  showBoxDebug() {
    if (this.boxs.length) this.boxs.forEach(box => Game.scene.remove(box))
    this.objects.forEach((obj, index) => {
      if (obj.showBoxDebug && obj.rigidBody) {
        const b = obj.rigidBody
        const box = new THREE.Mesh(
          geometry,
          new THREE.MeshPhongMaterial({ color: obj.boxColor, wireframe: obj.showBoxWireframe })
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
          const b = obj.rigidBody
          box.scale.set(b.extents[0] * 2, b.extents[1] * 2, b.extents[2] * 2)
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