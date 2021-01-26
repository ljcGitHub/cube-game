import { THREE, window } from 'common/libs'
import Game from 'base/Game'
import UI from 'base/UI'

const touchType = ['touchstart', 'touchmove', 'touchend']
const clickType = ['mousedown', 'mousemove', 'mouseup']
const handleType = [touchType, clickType]

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()
const w = window.innerWidth
const h = window.innerHeight

class Event {
  constructor() {
    this.events = []
    this.eventIds = {}
    this.objects = []
    this.uis = []
    handleType.forEach(types => {
      types.forEach((type, index) => {
        document.addEventListener(type, (e) => {
          this[touchType[index]](e)
        })
      })
    })
  }
  touchstart(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touche = e.changedTouches[i]
      const obj = this.intersect(touche)[0]
      if (obj && !this.eventIds[obj.object.uuid]) {
        this.eventIds[obj.object.uuid] = this.touchObjectData('touchstart', obj, touche)
      }
    }
    this.dispatch('touchstart', this.eventIds)
  }
  touchmove(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touche = e.changedTouches[i]
      for (const x in this.eventIds) {
        const item = this.eventIds[x]
        if (item.data.touche.identifier === touche.identifier) {
          item.type = 'touchmove'
          item.data.touche = touche
          break
        }
      }
    }
    this.dispatch('touchmove', this.eventIds)
  }
  touchend(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touche = e.changedTouches[i]
      for (const x in this.eventIds) {
        const item = this.eventIds[x]
        if (item.data.touche.identifier === touche.identifier) {
          item.type = 'touchend'
          item.data.touche = touche
        }
      }
    }
    this.dispatch('touchend', this.eventIds)
  }
  dispatch(type, eventIds) {
    this.events.forEach(e => {
      const event = eventIds[e.uuid]
      if (event && event.type === type) {
        e.event(type, event.data)
        if (type === 'touchend') {
          delete eventIds[e.uuid]
        }
      }
    })
  }
  filterObject() {
    this.filterObjectTimer && clearTimeout(this.filterObjectTimer)
    this.filterObjectTimer = setTimeout(() => {
      const objects = []
      const uis = []
      this.events.forEach(event => {
        if (event.type === 'ui') {
          uis.push(event.obj)
        } else {
          objects.push(event.obj)
        }
      })
      this.objects = objects
      this.uis = uis
    }, 100)
  }
  intersect(e) {
    let intersects = []
    mouse.x = (e.pageX / w) * 2 - 1
    mouse.y = - (e.pageY / h) * 2 + 1
    raycaster.setFromCamera(mouse, UI.cameraOrtho)
    if (this.uis.length) {
      intersects = raycaster.intersectObjects(this.uis)
    }
    if (intersects.length > 0) return intersects
    raycaster.setFromCamera(mouse, Game.camera)
    if (this.objects.length) {
      intersects = raycaster.intersectObjects(this.objects)
    }
    return intersects
  }
  touchObjectData(type, obj, touche) {
    return {
      type,
      data: {
        touche,
        uv: obj.uv,
        point: obj.point,
        uuid: obj.object.uuid
      }
    }
  }
}

const _event = new Event()

export const addEvent = function (type, obj, fn) {
  _event.events.push({ uuid: obj.uuid, obj, type, event: fn })
  _event.filterObject()
}

export const removeEvent = function (obj) {
  for (let i = 0; i < events.length; i++) {
    if (_event.events[i].uuid === obj.id) {
      _event.events.splice(i, 1)
      _event.filterObject()
      return false
    }
  }
}
