import React from 'react'
import { shallow } from 'enzyme'

import QubitReactWrapper from '../'

describe('when there is no handler', () => {
  it('renders the children', () => {
    const component = shallow(
      <QubitReactWrapper id='fooWrapper'>
        <h2 className='foo'>Foo</h2>
      </QubitReactWrapper>
    )
    expect(component.find('.foo').length).toBe(1)
  })
})

describe('when there is a handler', () => {
  let handler, component
  beforeEach(() => {
    handler = jest.fn((props) => {
      return <h2 className='bar'>Bar</h2>
    })
    window.__qubit = {
      react: {
        components: {
          fooWrapper: {
            renderFunction: handler
          }
        }
      }
    }
    component = shallow(
      <QubitReactWrapper id='fooWrapper'>
        <h2 className='foo'>Foo</h2>
      </QubitReactWrapper>
    )
  })
  afterEach(() => {
    window.__qubit = undefined
  })
  it('runs the handler function', () => {
    expect(handler).toHaveBeenCalled()
  })
  it('runs the handler with the correct props', () => {
    const props = {
      prop1: 'prop1',
      prop2: 'prop2'
    }
    const handler = (handlerProps) => {
      expect(handlerProps).toEqual(props)
    }
    window.__qubit = {
      react: {
        components: {
          fooWrapper: {
            renderFunction: handler
          }
        }
      }
    }
    component = shallow(
      <QubitReactWrapper
        id='fooWrapper'
        prop1={props.prop1}
        prop2={props.prop2}
      />
    )
  })
  it('renders the handler output', () => {
    expect(component.find('.bar').length).toBe(1)
  })
  it('doesn\'t render the original children', () => {
    expect(component.find('.foo').length).toBe(0)
  })
})

describe('when the handler throws an error', () => {
  let handler
  let component
  beforeEach(() => {
    handler = jest.fn((props) => {
      throw new Error('handler error')
    })
    window.__qubit = {
      react: {
        components: {
          fooWrapper: {
            renderFunction: handler
          }
        }
      }
    }
    component = shallow(
      <QubitReactWrapper id='fooWrapper'>
        <h2 className='foo'>Foo</h2>
      </QubitReactWrapper>
    )
  })
  afterEach(() => {
    window.__qubit = undefined
  })
  it('renders the children', () => {
    expect(component.find('.foo').length).toBe(1)
  })
})

describe('when the handler does not return a React element', () => {
  let handler
  let component
  beforeEach(() => {
    handler = jest.fn((props, React) => {
      return 'bad thing'
    })
    window.__qubit = {
      react: {
        components: {
          fooWrapper: {
            renderFunction: handler
          }
        }
      }
    }
    component = shallow(
      <QubitReactWrapper id='fooWrapper'>
        <h2 className='foo'>Foo</h2>
      </QubitReactWrapper>
    )
  })
  afterEach(() => {
    window.__qubit = undefined
  })
  it('renders the children', () => {
    expect(component.find('.foo').length).toBe(1)
  })
})
