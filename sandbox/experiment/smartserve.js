import {
  activation,
  execution
} from './experience'

var state = {}

var options = {
  meta: {},
  state: {
    set: (key, value) => { state[key] = value },
    get: (key) => { return state[key] }
  }
}

activation(options, () => {
  execution(options)
})
