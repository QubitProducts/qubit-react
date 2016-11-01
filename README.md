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

It is recommend that the included `qubit-react/experience` is used to interact with the wrapper as it provides a much simpler interface reducing a lot of boilerplate code.

#### `onReactReady(cb)`
Waits for React to become available and runs the callback. Useful if React is required to define reusable components.

This will run the callback synchronously if React is already available. If React is not yet available, it will wait for it and run the callback synchronously as soon as React is available. This means that the callback will always be run before the initial render of the wrapper, eliminating the chance of any flicker.

Example:
```js
var experience = require('qubit-react/experience')

experience.onReactReady(function (React) {
  var CustomHeader = React.createClass({
    render: function () {
      return <h2>{this.props.title}</h2>
    }
  })
  experience.register('searchHeader', function () {
    return <CustomHeader title='Search' />
  })
  experience.register('navHeader', function () {
    return <CustomHeader title='Navigation' />
  })
})
```

#### `register(id, renderFunction)`
Registers the provided render function for the specified wrapper and updates all instances. An API is returned with a dispose function which allows the render function to be unregistered, use this dispose function before attempting to register another render function on the wrapper as only one can be registered at any time. An error will be thrown if you attempt to register another render function before this.

Example:
```js
var experience = require('qubit-react/experience')

var searchHeader = experience.register('searchHeader', function (props, React) {
  return React.createElement('h2', null, 'Foo')
})

try {
  // An error will be thrown
  experience.register('searchHeader', function noop () {})
} catch (e) {}

setTimeout(function () {
  searchHeader.dispose()
}, 5000)
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
  update: [] // Proxies of the `forceUpdate` function for each instance of the wrapper that is mounted
}
```

Simply put, if the `renderFunction` exists, it will be used for the wrapper. Since the wrapper will not know when this is attached, the `update` functions should be called after attaching a new render function to ensure the relevant parts of the UI is rerendered.

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
window.__qubit.react.components.header.update.forEach((update) => update())
```

**Exposing React**

The wrapper will also expose React to `window.__qubit.react.React`. In the case that this is not yet available when your code runs (e.g. when the first instance of the wrapper has not yet been rendered), you can add a callback to the `window.__qubit.react.onReactReady` array. These will be called when React is first exposed.

```js
if (window.__qubit && window.__qubit.react && window.__qubit.react.React) {
  onReactReady(window.__qubit.react.React)
} else {
  // Ensure the object path exists and create it if it doesn't
  window.__qubit = window.__qubit || {}
  window.__qubit.react = window.__qubit.react || {}

  // Initiate the array if it's not there already
  window.__qubit.react.onReactReady = window.__qubit.react.onReactReady || []

  // Push your callback into the array
  window.__qubit.react.onReactReady.push(onReactReady)
}

function onReactReady (React) {
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
[driftwood]: https://github.com/QubitProducts/driftwood
[Qubit]: http://www.qubit.com
[Engineering site]: https://eng.qubit.com
