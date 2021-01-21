// 限制范围
export const limit = function (x, min, max) {
  return Math.max(min, Math.min(max, x))
}

// 是否在限制范围中
export const between = function (x, min, max) {
  return ((x >= min) && (x <= max))
}

// 随机数值
export const random = function (min, max) {
  return (min + (Math.random() * (max - min)))
}

// 随机整数
export const randomInt = function (min, max) {
  return Math.round(random(min, max))
}

// 数组随机获取一项
export const randomChoice = function(choices) {
  return choices[this.randomInt(0, choices.length - 1)]
}

// 16进制颜色变亮
export const brighten = function (hex, percent) {
  let a = Math.round(255 * percent / 100),
    r = a + parseInt(hex.substr(1, 2), 16),
    g = a + parseInt(hex.substr(3, 2), 16),
    b = a + parseInt(hex.substr(5, 2), 16);
  r = r < 255 ? (r < 1 ? 0 : r) : 255;
  g = g < 255 ? (g < 1 ? 0 : g) : 255;
  b = b < 255 ? (b < 1 ? 0 : b) : 255;
  return '#' + (0x1000000 + (r * 0x10000) + (g * 0x100) + b).toString(16).slice(1)
}

// 16进制颜色变暗
export const randomBool = function (hex, percent) {
  return brighten(hex, -1 * percent)
}