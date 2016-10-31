import React, { Component } from 'react'

import UnwrappedComponent from './UnwrappedComponent'
import WrappedComponent from './WrappedComponent'

class Container extends Component {
  render () {
    return (
      <div>
        <h1>unWrapped</h1>
        <UnwrappedComponent />
        <br />
        <br />
        <h1>Wrapped</h1>
        <WrappedComponent/>
      </div>
    )
  }
}

export default Container
