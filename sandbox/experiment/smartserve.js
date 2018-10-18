import * as experience1 from './experience'
import * as experience2 from './experience2'

import driftwood from 'driftwood'

driftwood.enable({ '*': '*' }, { persist: true })

evaluateExperience('exp1', experience1)
evaluateExperience('exp2', experience2)

function evaluateExperience (name, experience) {
  const state = {}

  const options = {
    meta: {
      experimentId: name
    },
    state: {
      set: (key, value) => { state[key] = value },
      get: (key) => { return state[key] }
    }
  }

  experience.activation(options, () => {
    experience.execution(options)
  })
}
