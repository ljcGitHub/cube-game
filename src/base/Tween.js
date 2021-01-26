import Game from 'base/Game'
import Easing from 'common/utils/tween'

const getEasingFn = function (fn) {
  if (typeof fn === 'string') {
    try {
      if (fn.indexOf('.') > -1) {
        const keys = fn.split('.')
        return Easing[keys[0]][keys[1]]
      } else {
        return Easing[fn]
      }
    } catch (error) {
      console.error('easing function error')
      return Easing.Linear
    }
  } else if (typeof fn === 'function') {
    return fn
  }
  return Easing.Linear
}

class Tween {
  constructor(option) {
    this._animation = true
    this._step = 0
    this._maxStep = Math.ceil(option.duration / (Game.step * 1000))
    this._tick()
    this._option = option
  }
  _tick() {
    Game.nextTick(() => {
      if (this._animation) {
        let val
        if (this._option.easing.constructor === Array) {
          val = this._option.easing.map(es => es(this._step / this._maxStep, 0, 1, 1))
        } else {
          val = this._option.easing(this._step / this._maxStep, 0, 1, 1)
        }
        if (this._step >= this._maxStep) {
          this._option.callback(val)
        } else {
          this._option.step(val)
          this._step++
          this._tick()
        }
      }
    })
  }
  play() {
    this._animation = true
    this._tick()
  }
  stop() {
    this._animation = false
  }
  reset() {
    this._step = 0
    this._animation = false
  }
}

export default function (easing, duration, step, callback) {
  const option = { 
    easing: easing || Easing.Linear,
    duration: duration || 400,
    step: step || function(){},
    callback: callback || function(){},
  }
  if (option.easing && option.easing.constructor === Array) {
    option.easing = option.easing.map(es => getEasingFn(es))
  } else {
    option.easing = getEasingFn(option.easing)
  }
  return new Tween(option)
}