import { window } from 'common/libs'

const w = window.innerWidth
const h = window.innerHeight
const width = 375

// 获取适配尺寸
export const setSize = size => size * w / width
// 获取mesh的width,height
export const getSize = e => e.geometry.parameters
// 获取顶部
export const getTop = (e) => h / 2 - getSize(e).height / 2
// 获取底部
export const getBotton = (e) => getSize(e).height / 2 - h / 2
// 获取左边
export const getLeft = (e) => getSize(e).width / 2 - w / 2
// 获取右边
export const getRight = (e) =>  w / 2 - getSize(e).width / 2