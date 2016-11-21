export function activation (options, cb) {
  window.initiate = require('../../experience')
  var experience = require('../../experience')(options.meta)
  window.opts = options

  var release = experience.register([
    'promo-banner-text'
  ], function (slots, React) {
    options.state.set('slots', slots)
    options.state.set('React', React)
    cb()
  })

  return {
    remove: release
  }
}

export function execution (options) {
  var saleEnds = Date.now() + (10 * 60 * 1000)

  var React = options.state.get('React')
  var slots = options.state.get('slots')

  class Countdown extends React.Component {
    componentWillMount () {
      const { endDate } = this.props
      this.state = {
        remaining: endDate - Date.now()
      }
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

  slots.render('promo-banner-text', function (props) {
    return <Countdown endDate={saleEnds} />
  })

  return {
    remove: slots.dispose
  }
}

