import { mount } from 'enzyme'

import experience from '../experience'

it('e2e - modern', async () => {
  let React = require('react')
  const QubitReactWrapper = require('../wrapper')
  const mounted = mount(
    <QubitReactWrapper id='wrapper'>
      <div className='wrapped' />
    </QubitReactWrapper>
  )

  // claim a wrapper
  const instance = experience({ owner: 'owner123' })

  await instance.register(['wrapper'])
  React = instance.getReact()

  expect(mounted.find('.wrapped').length).toEqual(1)
  expect(mounted.find('.replaced').length).toEqual(0)

  instance.render('wrapper', () => { return <div className='replaced' /> })
  mounted.update()
  expect(mounted.find('.wrapped').length).toEqual(0)
  expect(mounted.find('.replaced').length).toEqual(1)

  instance.render('wrapper', () => { return <div className='anotherThing' /> })
  mounted.update()
  expect(mounted.find('.wrapped').length).toEqual(0)
  expect(mounted.find('.replaced').length).toEqual(0)
  expect(mounted.find('.anotherThing').length).toEqual(1)

  instance.release()
  mounted.update()
  expect(mounted.find('.wrapped').length).toEqual(1)
  expect(mounted.find('.replaced').length).toEqual(0)
  expect(mounted.find('.anotherThing').length).toEqual(0)
})

it('e2e - multiple slots', async () => {
  const React = require('react')
  const QubitReactWrapper = require('../wrapper')
  const mounted = mount(
    <div>
      <QubitReactWrapper id='wrapper1'>
        <div className='wrapped' />
      </QubitReactWrapper>
      <QubitReactWrapper id='wrapper2'>
        <div className='wrapped' />
      </QubitReactWrapper>
    </div>
  )

  const instance = experience({ owner: 'owner123' })
  await instance.register(['wrapper1'])
  expect(mounted.find('.wrapped').length).toEqual(2)
  expect(mounted.find('.replaced').length).toEqual(0)

  instance.render('wrapper1', () => <div className='replaced' />)
  mounted.update()
  expect(mounted.find('.wrapped').length).toEqual(1)
  expect(mounted.find('.replaced').length).toEqual(1)

  await instance.register(['wrapper2'])
  instance.render('wrapper2', () => <div className='replaced' />)
  mounted.update()
  expect(mounted.find('.wrapped').length).toEqual(0)
  expect(mounted.find('.replaced').length).toEqual(2)

  instance.release('wrapper1')
  mounted.update()
  expect(mounted.find('.wrapped').length).toEqual(1)
  expect(mounted.find('.replaced').length).toEqual(1)

  instance.release()
  mounted.update()
  expect(mounted.find('.wrapped').length).toEqual(2)
  expect(mounted.find('.replaced').length).toEqual(0)
})

it('e2e - legacy', async () => {
  const React = require('react')
  const QubitReactWrapper = require('../wrapper')
  const mounted = mount(
    <QubitReactWrapper id='wrapper'>
      <div className='wrapped' />
    </QubitReactWrapper>
  )

  // claim a wrapper
  const [slots] = await new Promise((resolve) => {
    experience({ owner: 'owner123' }).register(['wrapper'], (slots, React) => resolve([slots, React]))
  })

  expect(mounted.find('.wrapped').length).toEqual(1)
  expect(mounted.find('.replaced').length).toEqual(0)

  slots.render('wrapper', () => { return <div className='replaced' /> })
  mounted.update()
  expect(mounted.find('.wrapped').length).toEqual(0)
  expect(mounted.find('.replaced').length).toEqual(1)

  slots.render('wrapper', () => { return <div className='anotherThing' /> })
  mounted.update()
  expect(mounted.find('.wrapped').length).toEqual(0)
  expect(mounted.find('.replaced').length).toEqual(0)
  expect(mounted.find('.anotherThing').length).toEqual(1)

  slots.release()
  mounted.update()
  expect(mounted.find('.wrapped').length).toEqual(1)
  expect(mounted.find('.replaced').length).toEqual(0)
  expect(mounted.find('.anotherThing').length).toEqual(0)
})
