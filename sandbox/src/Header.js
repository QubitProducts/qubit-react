import React, { Component } from 'react'

import QubitReact from '../../wrapper'

class Header extends Component {
  constructor () {
    super()
    this.state = {
      subtitles: 2
    }
  }
  // componentWillMount () {
  //   return
  //   this.interval = setInterval(() => {
  //     const current = this.state.subtitles
  //     this.setState({
  //       subtitles: current === 3 ? 1 : current + 1
  //     })
  //   }, 1000)
  // }
  componentWillUnmount () {
    clearInterval(this.interval)
  }
  render () {
    return (
      <div className='Header'>
        <div className='Header-title'>
          <span>Travel Direct</span>
        </div>
        <div className='Header-subtitle'>
          {this.renderSubtitles()}
        </div>
      </div>
    )
  }

  renderSubtitles () {
    const out = []
    for (let i = 0; i < this.state.subtitles; i++) {
      out.push(
        <QubitReact id='header-subtitle-text' key={i}>
          <span>
            for all your... travel needs
          </span>
        </QubitReact>
      )
    }
    return out
  }
}

export default Header
