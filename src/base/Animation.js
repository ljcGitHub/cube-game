import { THREE } from 'common/libs'

class Animation {
  constructor(gtlf) {
    this.animations = []
    this.mixer = new THREE.AnimationMixer(gtlf.scene)
    this.action = {}
    this.startAction = ''
    this.endAction = ''
    gtlf.animations.forEach(an => {
      this.action[an.name] = this.mixer.clipAction(an)
      this.animations.push(this.action[an.name])
    })
  }
  play(name, duration = 200) {
    this.endAction = this.startAction
    this.startAction = name
    const startAction = this.action[this.startAction]
    const endAction = this.action[this.endAction]
    if (startAction === endAction) return false
    if (startAction && endAction) {
      endAction.enabled = true
      endAction.setEffectiveTimeScale(1)
      endAction.setEffectiveWeight(1)
      endAction.time = 0
      endAction.stop()
      startAction.play()
      // startAction.crossFadeTo(endAction, duration, true )
    } else if (startAction){
      startAction.play()
    }
    this.runAction = this.startAction
  }
  update(dt) {
    this.mixer.update(dt)
  }
  destroy() {
    this.animations = null
  }
}

export default Animation