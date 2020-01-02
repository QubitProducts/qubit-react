# Qubit React [ ![Codeship Status for qubitdigital/qubit-react-wrapper](https://app.codeship.com/projects/d63db780-5b06-0134-b3eb-4297ec814d8e/status?branch=master)](https://app.codeship.com/projects/173267)

Smoothly integrate Qubit Experiences on React websites.

Wrap page components using `qubit-react/wrapper` and change their rendering behaviour from within Experiences to provide segment targeting, personalisation and A/B testing.

## Website Implementation
_This section refers to the changes that you need to make to your website codebase._

To expose a component for use in Experiences, wrap the relevant components with `qubit-react/wrapper`.

```js
import QubitReact from 'qubit-react/wrapper'

<QubitReact id='header' {...props}>
  <Header {...props} />
</QubitReact>

```

A unique `id` is required for each wrapped component. It is recommended that all props passed to the wrapped component are also passed to the wrapper. All the props passed to the wrapper component will be forwarded to your custom render function.

## Usage
_This section refers to the code that you write inside Qubit's platform._

In Qubit Experiences you can interact interact with the wrapper using the `options.react` interface.

### Activation

#### Registering for Wrapper Ownership

Qubit React has a concept of wrapper ownership. This means that only a single experience can control the contents of a wrapper at any given time. This reduces conflicts between experiences attempting to modify the same component.

Ownership will not be taken until the `options.react.render()` method is called in the experience execution function. It is your job to ensure that multiple experiences do not try to execute at the same time. If they do, only the first experience will execute succesfully; all subsequent attempts will result in an error being thrown.

In order to take ownership of a wrapper during the experience activation phase, use the `options.react.register()` method. You can claim multiple wrappers by passing in multiple wrapper IDs to register. This will return a promise that resolves once React is available and the wrapper is ready to render on the page.

```js
module.exports = function experienceActivation (options, cb) {
  options.react.register(['header']).then(cb)
}
```

### Execution

#### Render Content

Now that we are finally in execution phase, let's render some custom content into our wrapped component.

```js
module.exports = function experienceExecution (options) {
  const React = options.react.getReact()

  class NewHeader extends React.Component {
    render () {
      return <h2>NEW HEADER</h2>
    }
  }

  options.react.render('header', function (props) {
    return <NewHeader />
  })
}
```

### Rendering Original Content

Sometimes, it might be useful to render the original content temporarily. For example, if you show the original content, but then want to render something custom again, you could do this:

```js
module.exports = function experienceExecution (options) {
  const React = options.react.getReact()

  setTimeout(() => {
    // renders original content
    options.react.render('header', function (props) {
      return props.children
    })
    setTimeout(() => {
      // renders new content again
      options.react.render('header', function (props) {
        return <NewContent />
      })
    }, 5000)
  }, 5000)
}
```

### Manually releasing ownership

Qubit Experiences will automatically take care of releasing wrapper ownership when experiences restart due to virtual page views. If for some reason you need to release ownership under other circumstances, there is a method available to do so:

```js
module.exports = function experienceExecution (options) {
  options.react.render('header', () => <NewContent />)

  setTimeout(() => {
    options.react.release()
  }, 5000)
}
```

### Real World Example

#### Activation

```js
module.exports = function experienceActivation (options, cb) {
  var saleEnds = Date.UTC(2017, 0, 1, 0, 0, 0)
  var remaining = saleEnds - Date.now()
  if (remaining > (60 * 60 * 1000)) return
  if (remaining < 0) return

  options.state.set('saleEnds', saleEnds)
  options.react.register(['header-subtitle-text', 'promo-banner-text'], cb)
}
```

#### Execution

```js
module.exports = function experienceExecution (options) {
  var saleEnds = options.state.get('saleEnds')
  var React = options.react.getReact()

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
          options.react.release()
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

  options.react.render('header-subtitle-text', function (props) {
    return <span>Great offers somewhere...</span>
  })

  options.react.render('promo-banner-text', function (props) {
    return <Countdown endDate={saleEnds} />
  })
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

When a wrapper is first mounted, it creates an object under `window.__qubit.react.components[id]`, where the `id` is unique to the wrapper. There are three things on the object we care about:

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

// Add the generic handler to be called by the wrapper
window.__qubit.react.components.header.renderFunction = function (props, React) {
  // If an experience handler is available, use that, otherwise return props.children
}

// Register the specific experience handler
window.__qubit.react.components.header.owner = '12345' // experience ID
window.__qubit.react.components.header.ownerRenderFunction = function (props, React) {
  return <h2>New Site Header!</h2>
}

// Update all the components
window.__qubit.react.components.header.instances.forEach((instance) => instance.forceUpdate())
```

## FAQ

#### How and why should I migrate from the legacy `qubit-react/experience` package in my Experience code?

At the beginning of January 2020, we deprecated the old callback-based wrapper registration method and introduced a new promised-based one in its place. This was done for two main reasons:

1. The old API was overly-verbose and complex
2. Under certain scenarios, wrapper ownership would be claimed when an experience wasn't actually going to fire, preventing all other experiences from claiming that wrapper.

While both syntaxes are currently available, we will be removing support for the old callback-based registration in the future in version 2.0 of the `qubit-react/experience` package. Here is an example of how to upgrade to the new syntax:

**Old**
```js
function experienceActivation (options, cb) {
  const experience = require('qubit-react/experience')(options.meta)
  const release = experience.register(['header'], function (slots, React) {
    options.state.set('slots', slots)
    options.state.set('React', React)
  })
  return {
    remove: release
  }
}

function experienceExecution (options) {
  const React = options.state.get('React')
  const slots = options.state.get('slots')
  options.react.render('header', () => <div>New header!</div>)
  return {
    remove: slots.release
  }
}
```

**New**
```js
function experienceActivation (options, cb) {
  // In the new version, the slots and React instance are accessed via the dedicated
  // API interface, so there is no need to manually pass them through state.
  options.react.register(['header']).then(cb)
  // There is also no need to return a remove handler, because it is done for you.
}

function experienceExecution (options) {
  const React = options.react.getReact()
  options.react.render('header', () => <div>New header!</div>)
}
```

#### Is it possible to disable Qubit Experiences in a testing environment?

Yes. If you're already not loading Qubit's `smartserve.js` script in your testing environment then this shouldn't be an issue. Qubit React wrappers are a transparent noop pass through in that case and should not affect your tests. 

If you're running an e2e testing environment and loading `smartserve.js` script, you might want to take extra steps to ensure that Qubit Experiences don't alter your wrapped components in unexpected ways. There are 2 ways to achieve this.

Append the following query parameters to your URL `?qb_opts=remember&qb_experiences=-1`. This drops a cookie which persists the setting for the rest of the session.

Alternatively, drop a cookie in your server side or client side code. The cookie key is `qb_opts` and value is `%7B%22experiences%22%3A%5B-1%5D%7D`. Here's example JavaScript that drops the cookie:

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
