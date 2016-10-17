import React from 'react'

import UnwrappedComponent from './UnwrappedComponent'
import WrappedComponent from './WrappedComponent'

class Container extends React.Component {
  render () {
    return (
      <div>
        <UnwrappedComponent />
        <WrappedComponent
          id='wrapped'
        />
      </div>
    )
  }
}

export default Container
