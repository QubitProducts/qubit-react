import {
  activation,
  execution
} from './experience'

var state = {}

var options = {
  meta: {
    experimentId: 47147
  },
  state: {
    set: (key, value) => { state[key] = value },
    get: (key) => { return state[key] }
  }
}

activation(options, () => {
  execution(options)
})
