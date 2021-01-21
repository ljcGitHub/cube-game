import { THREE, canvas, window, Stats, OrbitControls } from 'common/libs'
import ThirdCameraControl from 'base/ThirdCameraControl'
import UI from 'base/UI'

const timestamp = () => new Date().getTime()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1010)
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })

const Game = {
  scene,
  camera,
  dt: 0,
  last: timestamp(),
  step: 1 / 60,
  slow: 1,
  dev: true,
  instances: [],
  ticks: [],
  run() {
    if (this.dev) {
      this.stats = Stats()
      this.controls = new OrbitControls(camera, renderer.domElement)
    }
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(40, 20, 30)
    camera.position.set(-20, 20, 0)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    scene.fog = new THREE.Fog(0xeeeeee, 500, 10000)
    scene.add(light)
    scene.add(camera)
    renderer.autoClear = false; // To allow render overlay on top of sprited sphere
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(scene.fog.color)
    requestAnimationFrame(() => {
      this.loop()
    })
  },
  update(step) {
    if (this.target) {
      this.target.update(step)
    }
  },
  render(dt) {
    this.ticks.forEach(fn => fn())
    this.ticks = []
    ThirdCameraControl.update()
    if (this.target) {
      this.target.render(dt)
      renderer.clear()
      renderer.render(this.scene, this.camera)
      renderer.clearDepth()
      renderer.render(UI.sceneOrtho, UI.cameraOrtho)
    }
  },
  addScene(scene) {
    if (!this.target) {
      this.target = scene
    }
    this.instances.push(scene)
  },
  removeScene(scene) {
    const index = this.instances.indexOf(scene)
    this.instances.splice(index, 1)
    if (this.instances[0]) {
      this.target = this.instances[0]
    }
  },
  loop() {
    this.now = timestamp()
    this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000)
    const slowStep = this.slow * this.step
    while (this.dt > slowStep) {
      this.dt -= slowStep
      this.update(this.step)
    }
    this.render(this.dt / this.slow)
    this.last = this.now
    requestAnimationFrame(() => this.loop())
    this.auxiliaryUtils()
  },
  nextTick(fn) {
    if (typeof fn === 'function') {
      this.ticks.push(fn)
    }
  },
  auxiliaryUtils() {
    if (this.dev) {
      this.stats.end()
      this.stats.begin()
      this.controls.update()
    }
  }
}

export default Game