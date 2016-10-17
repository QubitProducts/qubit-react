import React from 'react'

import QubitReactWrapper from '../../QubitReactWrapper'

class WrappedComponent extends React.Component {
  render () {
    return (
      <QubitReactWrapper id='wrappedComponent'>
        <img src='http://i.giphy.com/D1owo2thD7Ts4.gif' />
      </QubitReactWrapper>
    )
  }
}

export default WrappedComponent
