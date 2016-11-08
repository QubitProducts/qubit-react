import React, { Component } from 'react'

import Header from './Header'
import Body from './Body'

class Container extends Component {
  render () {
    return (
      <div>
        <Header/>
        <Body />
      </div>
    )
  }
}

export default Container
