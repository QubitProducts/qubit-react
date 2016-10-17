import React from 'react'

const componentId = 'wrappedComponent'

function updateAll () {
  window.__qubit.reactHooks[componentId].update.forEach(update => update())
}

export default function execution () {
  setTimeout(() => {
    const end = Date.now() + 3000
    function getRemaining () { return end - Date.now() }

    const interval = setInterval(() => {
      const remaining = getRemaining()
      if (remaining < 0) {
        delete window.__qubit.reactHooks[componentId].handler
        clearInterval(interval)
        updateAll()
        return
      }
      window.__qubit.reactHooks[componentId].handler = function (props) {
        return React.createElement('h2', null, `REVERTING IN ${remaining}`)
      }
      updateAll()
    }, 200)
  }, 1000)
}
