import { THREE } from 'common/libs'
import { guid } from 'common/utils/math'
import Physical from 'base/Physical'

const propsValue = {
  content: null, // 显示内容
  contentOffset: new THREE.Vector3(), // 显示内容偏移值
  position: new THREE.Vector3(), // 位置
  rotation: new THREE.Vector3(), // 旋转
  animation: null, // 动画对象
  rigidBody: null, // 刚体检测
  static: false, // 静态物体
  trigger: false, // 触发器
  rigidBodyType: '', // 刚体标签
  rigidBodyFilter: [], // 根据刚体标签过滤碰撞的刚体
  showBoxAxes: false, // 是否显示轴
  showBoxDebug: false, // 是否显示刚体的BOX盒子
  showBoxWireframe: true, // 是否显示刚体的BOX盒子
  boxColor: 0x19be6b, // BOX盒子颜色
  tag: '' // 标签
}

// 自定义的3d对象
class Object3D {
  constructor(option = {}) {
    const props = { ...propsValue, ...option }
    this.uid = guid()
    Object.keys(props).forEach(key => {
      this[key] = props[key]
    })
    this.positionChange = true
    this.updateRigidBody()
  }
  update(step) {
  }
  updateContent() {
    if (this.content) {
      this.content.position.x = this.contentOffset.x + this.position.x
      this.content.position.y = this.contentOffset.y + this.position.y
      this.content.position.z = this.contentOffset.z + this.position.z
    }
  }
  updateRigidBody() {
    if (this.rigidBody && this.positionChange) {
      this.positionChange = false
      this.rigidBody.setPosition(this.position)
      this.rigidBody.setRotation(this.rotation)
    }
  }
  updateAnimation(dt) {
    if (this.animation) {
      this.animation.update(dt)
    }
  }
  setAnimation(animation) {
    this.animation = animation
  }
  setContent(content) {
    this.content = content
    this.addContent && this.addContent(content)
  }
  setPosition(ps) {
    this.positionChange = true
    this.position.copy(ps)
    this.updateRigidBody()
  }
  translate(x, y, z) {
    if (this.rigidBody) {
      this.rigidBody.force.x = x
      this.rigidBody.force.y = y
      this.rigidBody.force.z = z
    }
  }
  setRotation(rs) {
    this.rotation.set(rs.rotation.x, rs.rotation.y, rs.rotation.z)
  }
  computedBox() {
    if (this.content) {
      this.content.position.copy(this.position)
      const box = new THREE.Box3().setFromObject(this.content)
      const width = box.max.x - box.min.x
      const height = box.max.y - box.min.y
      const depth = box.max.z - box.min.z
      if (this.rigidBody) {
        this.rigidBody.setExtents({ width, height, depth })
      } else {
        this.rigidBody = new Physical({ width, height, depth })
      }
    }
  }
  render(dt) {
    this.updateContent()
    this.updateAnimation(dt)
  }
  collision(boxs) {
  }
  destroy() {
    if (this.rigidBody) {
      this.rigidBody.destroy()
      this.rigidBody = null
    }
    if (this.animation) {
      this.animation.destroy()
      this.animation = null
    }
  }
}

export default Object3D