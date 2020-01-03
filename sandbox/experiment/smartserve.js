import * as experience1 from './experience'
import * as experience2 from './experience2'

import driftwood from 'driftwood'

driftwood.enable({ '*': 'debug' }, { persist: true })

evaluateExperience('exp1', experience1)
evaluateExperience('exp2', experience2)

function evaluateExperience (name, experience) {
  const state = {}
  const instance = require('../../experience')({ owner: name })

  const options = {
    meta: {
      experimentId: name
    },
    state: {
      set: (key, value) => { state[key] = value },
      get: (key) => { return state[key] }
    },
    react: {
      getReact: instance.getReact,
      render: instance.render,
      register: instance.register
    }
  }

  try {
    experience.activation(options, () => {
      try {
        experience.execution(options)
      } catch (e) {
        console.error(e)
      }
    })
  } catch (e) {
    console.error(e)
  }
}
