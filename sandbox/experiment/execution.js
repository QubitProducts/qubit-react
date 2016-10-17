import React from 'react'

export default function execution () {
  const reactTools = require('@qubit/react-tools')

  setTimeout(() => {
    const end = Date.now() + 3000
    function getRemaining () { return end - Date.now() }

    let unregister

    const interval = setInterval(() => {
      unregister && unregister()
      const remaining = getRemaining()
      if (remaining < 0) {
        clearInterval(interval)
        return
      }
      unregister = reactTools.registerHandler('wrappedComponent', function (props) {
        return React.createElement('h2', null, `REVERTING IN ${remaining}`)
      })
    }, 200)
  }, 1000)
}
