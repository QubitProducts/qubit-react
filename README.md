QubitReactWrapper
=================

A wrapper for React components to allow modifiction in Qubit Experiences

### What it does

By wrapping a component, Qubit React Wrapper will expose an API to a namespaced window object. This will allow custom handlers to be injected and override how the wrapped component will be rendered.

### Implementation

To expose a component for use in Experiences, you will need to simply wrap your component with the Qubit React Wrapper. For example:

```
<QubitReactWrapper id='header'>
  <Header />
</QubitReactWrapper>

```

A unique `id` is required for each wrapped component. Any other props passed to the wrapper component will be forwarded to your custom handler.

### Usage

#### @qubit/react-tools

It is recommend that @qubit/react-tools is used within Qubit Experiences to interact with the wrapper as it provides a much simpler interface reducing a lot of boilerplate code.

#### Manual usage

The wrapper will create an object under `window.__qubit.reactHooks[id]` where the `id` is unique to the wrapped component. An array will be exposed under the update key which is a proxy of the forceUpdate function on the mounted components. These will need to be called after a handler is added to rerender the UI.

To override the renderer, add a function to the object under the `handler` key
```js
// First ensure the object path exists and create it if it doesn't
window.__qubit = window.__qubit || {}
window.__qubit.reactHooks = window.__qubit.reactHooks || {}
window.__qubit.reactHooks.header = window.__qubit.reactHooks.header || {}

// Add the handler
window.__qubit.reactHooks.header.handler = function (props) {
  return React.createElement('h2', null, 'New Header')
}

// Update all the components
window.__qubit.reactHooks.header.update.forEeach(function (update) {
  update()
})
```

### Debugging

QubitReactWrapper uses [driftwood][] for logging. The API is exported to `window.__qubit.logger`, so to turn on logs run `window.__qubit.logger.enable()`. This will also work in production

### Development

#### Commands

- `make bootstrap` installs dependencies
- `make test` run tests
- `make sandbox` and then go to localhost:8080 to see the wrapper in action

[driftwood]: https://github.com/QubitProducts/driftwood

