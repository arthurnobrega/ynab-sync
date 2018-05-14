import main, { executeAction } from '.'
import savedActions from './__mocks__/data/savedActions.json'

describe('Main', () => {
  it('should return false if passing invalid actionType', async () => {
    const response = await main({ actionType: 'x' })

    expect(response).toBe(false)
  })

  it('should execute favorited nubank action', async () => {
    const response = await executeAction('nubank', savedActions[0])

    expect(response).toBe(true)
  })

  it('should execute favorited bb action', async () => {
    const response = await executeAction('bb', savedActions[0])

    expect(response).toBe(true)
  })
})
