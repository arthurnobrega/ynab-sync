import { askForUsername, askForPassword, askForFilter } from './questions'

describe('BB questions', () => {
  it('should return username', async () => {
    const username = await askForUsername()

    expect(username).toHaveProperty('branch', '12345')
    expect(username).toHaveProperty('account', '123456')
  })

  it('should return password', async () => {
    const username = await askForUsername()
    const password = await askForPassword(username)

    expect(password).toEqual('12345678')
  })

  it('should return filter', async () => {
    const filter = await askForFilter()

    expect(filter).toEqual('2018-01')
  })
})
