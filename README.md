# Qubit React [ ![Codeship Status for qubitdigital/qubit-react-wrapper](https://app.codeship.com/projects/d63db780-5b06-0134-b3eb-4297ec814d8e/status?branch=master)](https://app.codeship.com/projects/173267)

Smoothly integrate Qubit Experiences on React websites.

Wrap page components using `qubit-react/wrapper` and change their rendering behaviour from within Experiences to provide segment targeting, personalisation and A/B testing.

## Website Implementation

To expose a component for use in Experiences, wrap the relevant components with `qubit-react/wrapper`.

```js
import QubitReact from 'qubit-react/wrapper'

<QubitReact id='header' ...props>
  <Header ...props />
</QubitReact>

```

A unique `id` is required for each wrapped component. It is recommended that all props passed to the wrapped component are also passed to the wrapper. All the props passed to the wrapper component will be forwarded to your custom render function.

## Usage

In Qubit Experiences use `qubit-react/experience` to interact with the wrapper.

### Activation

#### Setup

First initiate the library by passing in the experience meta information.

```js
function experienceActivation (options, cb) {
  var experience = require('qubit-react/experience')(options.meta)
}
```

#### Claiming Wrapper Ownership

Qubit React has a concept of wrapper ownership. This means that only a single experience can control the contents of a wrapper at any given time. This reduces conflicts between experiences attempting to modify the same component.

In order to take ownership of a wrapper during the experience activation phase, use the `experience.register` function. You can claim multiple wrappers by passing in multiple wrapper IDs to register.

```js
function experienceActivation (options, cb) {
  var experience = require('qubit-react/experience')(options.meta)

  experience.register(['header'], function (slots, React) {
    // If we get here, it means we have successfully claimed the wrapper
  })
}
```

#### Releasing Wrapper Ownership

```js
function experienceActivation (options, cb) {
  var experience = require('qubit-react/experience')(options.meta)

  var release = experience.register(['header'], function (slots, React) {    
    // use state to pass the slots and React to execution
    options.state.set('slots', slots)
    options.state.set('React', React)
    cb()
  })

  return {
    remove: function () {
      // important to release the ownership of the wrappers
      // so that other experiences on other virtual pageviews
      // can claim them.
      release()
    }
  }
}
```

Calling `release` will render the original content of the wrapped component and release the ownership so that other experiences can claim it.

### Execution

#### Render Content

Now that we are finally in execution phase, let's render some custom content into our wrapped component.

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
  
  return {
    remove: function () {
      slots.release()
    }
  }
}
```

### Rendering Original Content

Sometimes, it might be useful to render the original content temporarily. For example, if you show the original content, but then want to render something custom again, you could do this:

```js
function experienceExecution (options) {
  var React = options.state.get('React')
  var slots = options.state.get('slots')
  
  // ...

  setTimeout(() => {
    // renders original content
    slots.render('header', function (props) {
      return props.children
    })
    setTimeout(() => {
      // renders new content again
      slots.render('header', function (props) {
        return <NewContent />
      })
    }, 5000)
  }, 5000)
  
  return {
    remove: function () {
      slots.release()
    }
  }
}
```

It's different from calling `slots.release()`, because release is final and the wrapper can't be used again in this experience. It's really meant for cleanup between virtual page views.

### Real World Example

#### Activation

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

#### Execution

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
    remove: slots.release
  }
}

```

## Debugging

QubitReact uses [driftwood][] for logging. Enable it via Developer Console.

```js
window.__qubit.logger.enable({'qubit-react:*': '*'}, {persist: true}) // enable qubit-react logs
window.__qubit.logger.enable({'*': '*'}, {persist: true}) // enable all logs
window.__qubit.logger.disable() // disable logs
```

Visit [driftwood][] to see the full API documentation.

### Behind the Scenes

This section provides technical details on how the wrapper works.

#### Determining render function

When a wrapper is first mounted, it creates an object under `window.__qubit.react.components[id]`, where the `id` is unique to the wrapper. There are two things on the object we care about:

```js
{
  renderFunction: (props, React) => {}, // If this is present, it will be used as the render function for the wrapper
  instances: [] // The instances of the mounted Qubit React wrappers
}
```


Simply put, if the `renderFunction` exists, it will be used by the wrapper. Since the wrapper will not know when this is attached, the `forceUpdate` functions should be called after attaching a new render function to ensure the relevant parts of the UI is rerendered.

This is what the `qubit-react/experience` does behind the scenes:

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

## FAQ

#### Is it possible to disable Qubit Experiences in a testing environment?

Yes. If you're not loading Qubit's `smartserve.js` script in your testing environment, Qubit React wrappers become a transparent pass through and should not affect your tests. If you're running an e2e testing environment, you might want to take extra steps to ensure that Qubit Experiences don't alter your wrapped components in unexpected ways.

There are 2 ways to achieve this.

One is to append query parameters to your URL: `?qb_opts=remember&qb_experiences=-1`. This also drops a cookie which persists this setting for the rest of the session.

The other way is to drop a cookie in your server side or client side code. The cookie key is `qb_opts` and value is `%7B%22experiences%22%3A%5B0%5D%7D`. Here's example JavaScript that drops the cookie:

```js
document.cookie = 'qb_opts=' + encodeURIComponent(JSON.stringify({"experiences":[-1]})) + "; path=/"
```

The `experiences` option is typically used to force execution of a specific Qubit Experience. Specifying -1 signals that nothing should be executed, which keeps your testing environment clear of Experiences.

## Development

### Setup

This project uses [yarn][] for dependency management, to get up and running

```
$ npm i -g yarn
$ make bootstrap
```

### Running tests

Tests are implemented with [jest][]:

- `make test` to run tests
- `make test-watch` to run tests in watch mode

### Sandbox

Simulates an environment to play around with the wrapper and experience utility library. Run `make sandbox` and then go to localhost:8080 to see the wrapper in action.

## Want to work on this for your day job?

This project was created by the Engineering team at [Qubit][]. As we use open source libraries, we make our projects public where possible.

We’re currently looking to grow our team, so if you’re a JavaScript engineer and keen on ES2016 React+Redux applications and Node micro services, why not get in touch? Work with like minded engineers in an environment that has fantastic perks, including an annual ski trip, yoga, a competitive foosball league, and copious amounts of yogurt.

Find more details on our [Engineering site][]. Don’t have an up to date CV? Just link us your Github profile! Better yet, send us a pull request that improves this project.

[yarn]: https://github.com/yarnpkg/yarn
[jest]: https://facebook.github.io/jest/
[driftwood]: https://github.com/QubitProducts/driftwood
[Qubit]: http://www.qubit.com
[Engineering site]: https://eng.qubit.com
