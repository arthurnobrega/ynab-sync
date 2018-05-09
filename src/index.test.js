import main, { executeAction } from '.'
import savedActions from './__mocks__/data/savedActions.json'

describe('Main', () => {
  it('should do nothing if passing invalid actionType', async () => {
    const response = await main({ actionType: 'x' })

    expect(response).toBe(true)
  })

  it('should do nothing if passing invalid actionType', async () => {
    const response = await executeAction(savedActions[0])

    expect(response).toBe(true)
  })
})
