import Game from 'base/Game'
import Scene from 'base/Scene'
import Object3D from 'base/Object3D'
import Physical from 'base/Physical'
import CameraFollow from 'base/ThirdCameraControl'
import { THREE } from 'common/libs'
import joystick from 'components/Joystick'
import { getTop, getLeft } from 'common/utils/ui-adapter'

var scene = new Scene()

var obj = new Object3D({
  rigidBody: new Physical({ width: 4, height: 5, depth: 2 }),
  boxColor: 0xf8f8f8, // BOX盒子颜色
  position: new THREE.Vector3(8, 0, 0),
  tag: '0',
  showBoxDebug: true
})
scene.add(obj)

var obj1 = new Object3D({
  rigidBody: new Physical({ width: 4, height: 5, depth: 4 }),
  position: new THREE.Vector3(0, 0, 0),
  boxColor: 0xdcdcdc, // BOX盒子颜色
  tag: '1',
  showBoxDebug: true
})
scene.add(obj1)

scene.showBoxDebug()

var keyBoss = {
  right: 0,
  top: 0
}

document.addEventListener('keydown', function (e) {
  let key = e.key.toLocaleUpperCase()
  switch (key) {
    case 'W':
      keyBoss.right = 0.2
      break
    case 'S':
      keyBoss.right = -0.2
      break
    case 'A':
      keyBoss.top = -0.2
      break
    case 'D':
      keyBoss.top = 0.2
      break
    default:
      break
  }
})

document.addEventListener('keyup', function (e) {
  let key = e.key.toLocaleUpperCase()
  switch (key) {
    case 'W':
    case 'S':
      keyBoss.right = 0
      keyBoss.right = 0
      break
    case 'A':
    case 'D':
      keyBoss.top = 0
      keyBoss.top = 0
      break
    default:
      break
  }
})

obj1.collision = function(boxs) {
  if (boxs.length) {
    document.querySelector('.board').innerHTML = '碰撞了'
  } else {
    document.querySelector('.board').innerHTML = ''
  }
}

Game.run()


setInterval(() => {
  var x = 0, y = 0, z = 0
  if (keyBoss.top !== 0) {
    y = keyBoss.top
  }
  if (keyBoss.right !== 0) {
    x = keyBoss.right
  }
  obj1.movePostion(x, 0, y)
}, 1000/60)