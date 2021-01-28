const nullHanlde = function () { }
const beforeHanlde = function () { return true }

// var fsm = new FSM({
//   init: 'solid',
//   transitions: [
//     { name: 'melt',     from: 'solid',  to: 'liquid' },
//     { name: 'condense', from: 'gas',    to: 'liquid' }
//   ],
//   methods: {
//     melt:     function() { console.log('I melted')    },
//     beforeMelt:     function() { console.log('I melted')    }
//   }
// })

// 简单的状态管理器
class FSM {
  constructor(option) {
    this.state = option.init || 'idle'
    this.transitions = option.transitions || []
    this.methods = option.methods || {}
    this.initEvents()
  }
  initEvents() {
    this.transitions.forEach(item => {
      const n = item.name
      if (n && !this[n]) {
        item.variables = 'before' + n.substr(0, 1).toLocaleUpperCase() + n.substr(1)
        this[n] = this.methods[n] || nullHanlde
        this[state.variables] = this.methods[item.variables] || beforeHanlde
      }
    })
  }
  update() {
    for (const event of this.transitions) {
      if (this.state === event.from) {
        if (this[event.variables]()) {
          this[event.name]()
          this.state = event.to
          break
        }
      }
    }
  }
}

export default FSM