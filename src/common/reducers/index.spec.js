import reducer from './index'

describe('Root reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot()
  })
})
