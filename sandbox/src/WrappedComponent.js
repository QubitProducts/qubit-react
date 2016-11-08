import React, { Component } from 'react'

import QubitReact from '../../wrapper'

class WrappedComponent extends Component {
  render () {
    return (
      <QubitReact id={this.props.id}>
        <img src='http://i.giphy.com/D1owo2thD7Ts4.gif' />
      </QubitReact>
    )
  }
}

export default WrappedComponent
