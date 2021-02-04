import { THREE } from 'common/libs'
import Game from 'base/Game'
import Object3D from 'base/Object3D'
import Assets from 'base/Assets'
import Animation from 'base/Animation'
import FSM from 'base/FSM'
import CameraFollow from 'components/ThirdCameraControl'
import Joystick from 'components/Joystick'

const Idle = Assets.loadModel('/kib/idle.gltf')
const Jump = Assets.loadModel('/kib/jump.gltf')
const Run = Assets.loadModel('/kib/run.gltf')

class Character extends Object3D {
  constructor(option) {
    super(option)
    this.offset = new THREE.Vector2()
    this.createdUIControlCamera()
    this.speed = 4
    this.deltaTime = 0
    Idle.load(idle => {
      Jump.load(jump => {
        Run.load(run => {
          jump.animations[0].name = 'jump'
          run.animations[0].name = 'run'
          idle.animations[0].name = 'idle'
          idle.animations.push(jump.animations[0])
          idle.animations.push(run.animations[0])
          this.contentOffset.y = -0.8
          idle.scene.scale.x = 0.01
          idle.scene.scale.y = 0.01
          idle.scene.scale.z = 0.01
          this.setAnimation(new Animation(idle))
          this.setContent(idle.scene)
        })
      })
    })
    const action = name => this.animation.play(name, 400)
    this.fms = new FSM({
      init: 'idle',
      transitions: [
        { name: 'idleToRun', from: 'idle', to: 'run' },
        { name: 'idleToJump', from: 'idle', to: 'jump' },
        { name: 'runToIdle', from: 'run', to: 'idle' },
        { name: 'runToJump', from: 'run', to: 'jump' },
        { name: 'jumpToIdle', from: 'jump', to: 'idle' },
        { name: 'jumpToRun', from: 'jump', to: 'run' }
      ],
      methods: {
        beforeIdleToRun: () => {
          return this.rigidBody.isGrounded && this.offset.x != 0 && this.offset.y != 0
        },
        beforeJumpToRun: () => {
          return this.rigidBody.isGrounded && this.offset.x != 0 && this.offset.y != 0
        },
        beforeIdleToJump: () => {
          return !this.rigidBody.isGrounded
        },
        beforeRunToJump: () => {
          return !this.rigidBody.isGrounded
        },
        beforeRunToIdle: () => {
          return this.rigidBody.isGrounded && this.offset.x == 0 && this.offset.y == 0
        },
        beforeJumpToIdle: () => {
          return this.rigidBody.isGrounded && this.offset.x == 0 && this.offset.y == 0
        },
        runToIdle: () => action('idle'),
        runToJump: () => action('jump'),
        idleToJump: () => action('jump'),
        idleToRun: () => action('run'),
        jumpToRun: () => action('run'),
        jumpToIdle: () => action('idle')
      }
    })
  }
  createdUIControlCamera() {
    this.cameraFollow = new CameraFollow()
    this.cameraFollow.setControl(this, Game.camera)
    this.joystick = new Joystick({
      touchstart: this.touchstart.bind(this),
      touchmove: this.touchmove.bind(this),
      touchend: this.touchend.bind(this)
    })
    this.joystick.setPosition(0, -200)
  }
  removeUIControlCamera() {
    this.joystick.destroy()
    this.cameraFollow.destroy()
  }
  touchstart(e) {
    this.offsetX = e.touche.pageX
    this.offsetY = e.touche.pageY
    this.offset.x = 0
    this.offset.y = 0
  }
  touchmove(e) {
    const newPosition = new THREE.Vector2(
      e.touche.pageX - this.offsetX,
      e.touche.pageY - this.offsetY
    ).normalize()
    this.offset.x = newPosition.x * this.joystick.maxLen
    this.offset.y = newPosition.y * this.joystick.maxLen
    this.offset = this.offset.normalize()
    this.moveChange = true
  }
  touchend(data) {
    this.offset.x = 0
    this.offset.y = 0
    this.moveChange = false
  }
  update(step) {
    super.update(step)
    if (this.rigidBody) {
      this.translate(this.offset.x * this.speed * Game.step, -1, this.offset.y * this.speed * Game.step)
    }
    if (this.content && this.moveChange) {
      this.content.rotation.y = Math.atan2(this.offset.x, this.offset.y)
    }
    if (this.animation) {
      this.fms.update()
    }
  }
  destroy() {
    this.removeUIControlCamera()
    super.destroy()
  }
}

export default Character
