import { emailValid } from './validators'

describe('Validators', () => {
  test('#emailValid', () => {
    expect(emailValid()).toEqual(false)
    expect(emailValid('')).toEqual(false)
    expect(emailValid(undefined)).toEqual(false)
    expect(emailValid(null)).toEqual(false)
    expect(emailValid('just text')).toEqual(false)
    expect(emailValid('foo@')).toEqual(false)
    expect(emailValid('foo@bar')).toEqual(false)
    expect(emailValid('foo@bar.')).toEqual(false)
    expect(emailValid('foo@bar.c')).toEqual(true)
    expect(emailValid('foo@bar.com')).toEqual(true)
    expect(emailValid('foo@bar.com@')).toEqual(true) // TODO: should be false, improve validation
  })
})
