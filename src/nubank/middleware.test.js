import { setLoginToken, requestNewToken, getBillByMonth } from './middleware'
import nubankToken from '../__mocks__/data/nubankToken.json'

describe('Nubank middleware', () => {
  it('should set token and return it', async () => {
    const token = await setLoginToken(nubankToken)

    expect(token).toHaveProperty('access_token', nubankToken.access_token)
    expect(token).toHaveProperty('refresh_before', nubankToken.refresh_before)
    expect(token).toHaveProperty('_links', nubankToken._links)
  })

  it('should return new token', async () => {
    const token = await requestNewToken('45678932158')

    expect(token).toHaveProperty('access_token')
    expect(token).toHaveProperty('refresh_before')
    expect(token).toHaveProperty('_links')
  })

  it('should return bill by month', async () => {
    const { bill } = await getBillByMonth('2018-05')

    expect(bill).toHaveProperty('state')
    expect(bill).toHaveProperty('line_items')
  })
})
