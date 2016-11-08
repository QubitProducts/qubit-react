import experience from '../../experience'

const wrapperId = 'wrappedComponent'

export function activation (options, cb) {
  const experience = require('../../experience')

  experience.register([
    'wrappedComponent',
    'wrappedComponent2'
  ], (slots, React) => {
    options.state.set('slots', slots)
    options.state.set('React', React)

    cb()
  })
}

export function execution (options) {
  const slots = options.state.get('slots')
  const React = options.state.get('React')

  class Countdown extends React.Component {
    componentWillMount () {
      const end = Date.now() + 2000
      this.state = {
        remaining: end - Date.now()
      }
      const interval = setInterval(() => {
        const remaining = end - Date.now()
        this.setState({ remaining: end - Date.now() })
        if (remaining < 0) {
          clearInterval(interval)
        }
      }, 98)
    }

    render () {
      return <div>{`${this.state.remaining}ms left`}</div>
    }
  }

  class Notice extends React.Component {
    render () {
      return <h2>{`Replacement: ${this.props.message}`}</h2>
    }
  }

  slots.render('wrappedComponent', (props) => {
    return <Notice message='first one' />
  })

  slots.render('wrappedComponent2', (props) => {
    return <Countdown />
  })

  setTimeout(slots.dispose, 3000)
}

