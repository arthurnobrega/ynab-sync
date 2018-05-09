import { askForUsername, askForPassword, askForFilter } from './questions'

describe('Nubank questions', () => {
  it('should return username', async () => {
    const username = await askForUsername()

    expect(username).toEqual('45678932158')
  })

  it('should return password', async () => {
    const password = await askForPassword('45678932158')

    expect(password).toEqual('123456')
  })

  it('should return filter', async () => {
    const filter = await askForFilter()

    expect(filter).toEqual('2018-01')
  })
})
