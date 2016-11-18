import React, { Component } from 'react'

import QubitReact from '../../wrapper'

class Header extends Component {
  render () {
    return (
      <div className='Header'>
        <div className='Header-title'>
          <span>Travel Direct</span>
        </div>
        <div className='Header-subtitle'>
          <QubitReact id='header-subtitle-text'>
            <span>
              for all your... travel needs
            </span>
          </QubitReact>
        </div>
      </div>
    )
  }
}

export default Header
