import inquirer from 'inquirer'
import main, { executeAction } from '.'
import savedActions from './__mocks__/data/savedActions.json'

describe('Main', () => {
  it('should return false if passing invalid actionType', async () => {
    const response = await main({ actionType: 'x' })

    expect(response).toBe(false)
  })
  it('should return false if passing invalid actionType', async () => {
    const response = await main({ actionType: 'x' })

    expect(response).toBe(false)
  })

  it('should execute favorited nubank action', async () => {
    const response = await executeAction(savedActions[0])

    expect(response).toBe(true)
  })

  it('should execute favorited bb action', async () => {
    const response = await executeAction(savedActions[0])

    expect(response).toBe(true)
  })

  // it('should execute flow without questions', async () => {
  //   const spy = jest.spyOn(inquirer, 'prompt')
  //   await main({
  //     actionType: 'FAVORITE',
  //     args: {
  //       yesToAllOnce: true,
  //       password: '123456',
  //     },
  //   })

  //   expect(spy).not.toHaveBeenCalled()
  // })
})
