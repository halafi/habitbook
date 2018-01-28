// TODO: improve
export const emailValid = email => {
  if (!email.length) {
    return false
  }
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}
