# Qubit React [ ![Codeship Status for qubitdigital/qubit-react-wrapper](https://app.codeship.com/projects/d63db780-5b06-0134-b3eb-4297ec814d8e/status?branch=master)](https://app.codeship.com/projects/173267)

A library for enabling Qubit Experiences on React sites

By wrapping a component, Qubit React Wrapper will expose an API to a namespaced window object. This will allow custom render functions to be injected and override how the wrapped component will be rendered.

## Site Implementation

To expose a component for use in Experiences, you will need to simply wrap your component with `qubit-react/wrapper`. For example:

```js
import QubitReact from 'qubit-react/wrapper'

<QubitReact id='header' ...props>
  <Header ...props />
</QubitReact>

```

A unique `id` is required for each wrapped component. It is recommended that all props passed to the wrapped component are also passed to the wrapper. All the props passed to the wrapper component will be forwarded to your custom render function.

## Usage

The included `qubit-react/experience` library is used to interact with the wrapper while working in Qubit Experiences.

To initiate the library, the experience meta information needs to be passed in:

```js
function experienceActivation (options, cb) {
  var experience = require('qubit-react/experience')(options.meta)
}
```

### Claiming wrappers

Qubit React uses a concept of wrapper ownership, which means that only a single experience can control the contents of a wrapper at any time. This reduces conflicts between experiences attempting to modify the same component.

In order to take ownership of a wrapper, we use the `experience.register` function

```js
function experienceActivation (options, cb) {
  var experience = require('qubit-react/experience')(options.meta)

  experience.register(['header'], function (slots, React) {
    // If we get here, it means we have successfully claimed the wrapper
  })
}
```
### Releasing ownership

There are two ways to release ownership of wrappers, both function calls are identical but obtained in different ways to allow them to more easily suit the experience workflow.

```js
function experienceActivation (options, cb) {
  var experience = require('qubit-react/experience')(options.meta)

  var releaseMethod1, releaseMethod2

  var releaseMethod1 = experience.register(['header'], function (slots, React) {
    releaseMethod2 = slots.dipose
  })

  // releaseMethod1 === releaseMethod2
}
```

Releasing the wrappers will remove all render functions attached and rerender the wrappers.

### Rendering custom components

```js
function experienceExecution (options) {
  var React = options.state.get('React')
  var slots = options.state.get('slots')

  class NewHeader extends React.Component {
    render () {
      return <h2>NEW HEADER</h2>
    }
  }

  slots.render('header', function (props) {
    return <NewHeader />
  })
}
```

### And unrendering...

```js
function experienceExecution (options) {
  var React = options.state.get('React')
  var slots = options.state.get('slots')

  class NewHeader extends React.Component {
    render () {
      return <h2>NEW HEADER</h2>
    }
  }

  slots.render('header', function (props) {
    return <NewHeader />
  })

  setTimeout(() => {
    slots.unrender('header')
  }, 5000)
}
```


### Full example

**activation:**
```js
function experienceActivation (options, cb) {
  var experience = require('qubit-react/experience')(options.meta)

  var saleEnds = Date.UTC(2017, 0, 1, 0, 0, 0)
  var remaining = saleEnds - Date.now()
  if (remaining > (60 * 60 * 1000)) return
  if (remaining < 0) return

  var release = experience.register([
    'header-subtitle-text',
    'promo-banner-text'
  ], function (slots, React) {
    options.state.set('saleEnds', saleEnds)
    options.state.set('slots', slots)
    options.state.set('React', React)
    cb()
  })

  return {
    remove: release
  }
}
```

**execution:**
```js
function experienceExecution (options) {
  var saleEnds = options.state.get('saleEnds')
  var React = options.state.get('React')
  var slots = options.state.get('slots')

  class Countdown extends React.Component {
    componentWillMount () {
      const { endDate } = this.props
      this.state = {
        remaining: endDate - Date.now()
      }
      const interval = setInterval(() => {
        const remaining = endDate - Date.now()
        this.setState({ remaining: endDate - Date.now() })
        if (remaining < 0) {
          clearInterval(interval)
        }
      }, 1000)
    }

    render () {
      let secsLeft = Math.floor(this.state.remaining / 1000)
      const minsLeft = Math.floor(secsLeft / 60)
      secsLeft = secsLeft - (minsLeft * 60)
      return <span>{`${minsLeft} mins and ${secsLeft} secs left`}</span>
    }
  }

  slots.render('header-subtitle-text', function (props) {
    return <span>Great offers somewhere...</span>
  })

  slots.render('promo-banner-text', function (props) {
    return <Countdown endDate={saleEnds} />
  })

  return {
    remove: slots.dispose
  }
}

```

## Debugging

QubitReact uses [driftwood][] for logging. The API is exported to `window.__qubit.logger`, run `window.__qubit.logger.enable()` to turn on logs. Visit [driftwood][] to see the full API documentation.

### More low level stuff...

This section provides more technical details on how the wrapper operates.

**Determining render function**

When a wrapper is first mounted, it will create an object under `window.__qubit.react.components[id]`, where the `id` is unique to the wrapper. There are two things on the object we care about:

```js
{
  renderFunction: (props, React) => {}, // If this is present, it will be used as the render function for the wrapper
  instances: [] // The instances of the mounted Qubit React wrappers
}
```

Simply put, if the `renderFunction` exists, it will be used for the wrapper. Since the wrapper will not know when this is attached, the `forceUpdate` functions on the instances should be called after attaching a new render function to ensure the relevant parts of the UI are rerendered.

```js
// First ensure the object path exists and create it if it doesn't
// This will be the case if no instances of the wrapper has been mounted
window.__qubit = window.__qubit || {}
window.__qubit.react = window.__qubit.react || {}
window.__qubit.react.components = window.__qubit.react.components || {}
window.__qubit.react.components.header = window.__qubit.react.components.header || {}

// Add the handler
window.__qubit.react.components.header.renderFunction = function (props, React) {
  return <h2>New Site Header!</h2>
}

// Update all the components
window.__qubit.react.components.header.instances.forEach((instance) => instance.forceUpdate())
```

**Exposing React and ReactDOM**

The wrapper will also expose React and ReactDOM to `window.__qubit.react.React` and `window.__qubit.react.ReactDOM` respectively. In the case that this is not yet available when your code runs (e.g. when the first instance of the wrapper has not yet been rendered), you can add a callback to the `window.__qubit.react.onReactReady` array. These will be called when React is first exposed.

```js
if (window.__qubit && window.__qubit.react && window.__qubit.react.React && window.__qubit.react.ReactDOM) {
  onReactReady(window.__qubit.react.React, window.__qubit.react.ReactDOM)
} else {
  // Ensure the object path exists and create it if it doesn't
  window.__qubit = window.__qubit || {}
  window.__qubit.react = window.__qubit.react || {}

  // Initiate the array if it's not there already
  window.__qubit.react.onReactReady = window.__qubit.react.onReactReady || []

  // Push your callback into the array
  window.__qubit.react.onReactReady.push(onReactReady)
}

function onReactReady (React, ReactDOM) {
  // Run your code
  var CustomComponent = React.createClass({ ... })
}
```

## Development

### Setup

This project uses [yarn][] for dependency management, to get up and running

```
npm i -g yarn
make bootstrap
```

### Running tests

Tests are implemented with [jest][]:

- `make test` to run tests
- `make test-watch` to run tests in watch mode

### Sandbox

Simulates an environment to play around with the wrapper and experience utility library.
`make sandbox` and then go to localhost:8080 to see the wrapper in action


## Want to work on this for your day job?

This project was created by the Engineering team at [Qubit][]. As we use open source libraries, we make our projects public where possible.

We’re currently looking to grow our team, so if you’re a JavaScript engineer and keen on ES2016 React+Redux applications and Node micro services, why not get in touch? Work with like minded engineers in an environment that has fantastic perks, including an annual ski trip, yoga, a competitive foosball league, and copious amounts of yogurt.

Find more details on our [Engineering site][]. Don’t have an up to date CV? Just link us your Github profile! Better yet, send us a pull request that improves this project.

[yarn]: https://github.com/yarnpkg/yarn
[jest]: https://facebook.github.io/jest/
[driftwood]: https://github.com/QubitProducts/driftwood
[Qubit]: http://www.qubit.com
[Engineering site]: https://eng.qubit.com
