@qubit/react-tools
=====

A small utility library that works with https://github.com/qubitdigital/qubit-react-wrapper to allow Qubit Experiences to A/B test React sites

#### `onReactReady(cb)`
Waits for React to become available and runs the callback. Useful if React is required to define reusable components.

Example:

```js
var reactTools = require('@qubit/react-tools')

reactTools.onReactReady(function (React) {
  var CustomHeader = React.createClass({
    render: function () {
      return <h2>{this.props.title}</h2>
    }
  })
  reactTools.registerRender('searchHeader', function () {
    return <CustomHeader title='Search' />
  })
  reactTools.registerRender('navHeader', function () {
    return <CustomHeader title='Navigation' />
  })
})
```

#### `registerRender(id, renderFunction)`
Registers the provided render function for the specified component and updates all instances. An API is returned with a dispose function which allows the render function to be unregistered, use this before attempting to register another render function as only one can be registered at any time. An error will be thrown if you attempt to register another render function before this.

Example:

```js
var reactTools = require('@qubit/react-tools')

var searchHeaderApi = reactTools.registerRender('searchHeader', function (props, React) {
  return React.createElement('h2', null, 'Foo')
})

try {
  // An error will be thrown
  reactTools.registerRender('searchHeader', function noop () {})
} catch (e) {}

setTimeout(function () {
  searchHeaderApi.dispose()
}, 5000)
```

#### `registerComponent(id, component)`
Registers the provided component to be rendered with props passed into the wrapper.

Example:

```js
var reactTools = require('@qubit/react-tools')

reactTools.onReactReady(function (React) {
  var CustomHeader = React.createClass({
    render: function () {
      return <h2>{this.props.title}</h2>
    }
  })
  reactTools.registerComponent('searchHeader', CustomHeader)
  reactTools.registerComponent('navHeader', CustomHeader)
})
```