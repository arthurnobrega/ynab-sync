import main, { executeAction, flows } from '.'
import savedActions from './__mocks__/data/savedActions.json'

describe('Main', () => {
  it('should return false if passing invalid actionType', async () => {
    const response = await main({ actionType: 'x' })

    expect(response).toBe(false)
  })

  it('should execute favorited nubank action', async () => {
    const response = await executeAction(flows[0], savedActions[0])

    expect(response).toBe(true)
  })

  it('should execute favorited bb action', async () => {
    const response = await executeAction(flows[1], savedActions[0])

    expect(response).toBe(true)
  })
})
