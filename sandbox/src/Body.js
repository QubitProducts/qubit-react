import React, { Component } from 'react'

import QubitReact from '../../wrapper'

class Body extends Component {
  render () {
    return (
      <div className='App-body'>
        <div className='PromoBanner'>
          <QubitReact id='promo-banner-text'>
            <span className='PromoBanner-text'>A wild promo appeared</span>
          </QubitReact>
        </div>
      </div>
    )
  }
}

export default Body
