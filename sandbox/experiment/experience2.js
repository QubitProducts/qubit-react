export function activation (options, cb) {
  window.opts = options

  options.react.register(['promo-banner-text']).then(cb)
}

export function execution (options) {
  var React = options.react.getReact()

  var saleEnds = Date.now() + (10 * 60 * 1000)

  class Countdown extends React.Component {
    componentWillMount () {
      const { endDate } = this.props
      this.setState({
        remaining: endDate - Date.now()
      })
      this.interval = setInterval(() => {
        const remaining = endDate - Date.now()
        this.setState({ remaining: endDate - Date.now() })
        if (remaining < 0) {
          clearInterval(this.interval)
        }
      }, 1000)
    }

    componentWillUnmount () {
      clearInterval(this.interval)
    }

    render () {
      let secsLeft = Math.floor(this.state.remaining / 1000)
      const minsLeft = Math.floor(secsLeft / 60)
      secsLeft = secsLeft - (minsLeft * 60)
      return <span>{`${minsLeft} mins and ${secsLeft} secs left`}</span>
    }
  }

  options.react.render('promo-banner-text', function (props) {
    return <Countdown endDate={saleEnds} />
  })
}
