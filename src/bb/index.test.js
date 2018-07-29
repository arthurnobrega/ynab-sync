import inquirer from 'inquirer'
import executeBBFlow from '.'
import savedActions from '../__mocks__/data/savedActions.json'

describe('BB flow', () => {
  it('should return array of transactions in correct form', async () => {
    const { username, transactions } = await executeBBFlow()

    expect(username).toHaveProperty('branch', '12345')
    expect(username).toHaveProperty('account', '123456')
    expect(transactions.length).toEqual(3)
    expect(transactions[0]).toHaveProperty('import_id')
    expect(transactions[0]).toHaveProperty('amount')
    expect(transactions[0]).toHaveProperty('date')
    expect(transactions[0]).toHaveProperty('memo')
  })

  it('should execute bb action without questions', async () => {
    const spy = jest.spyOn(inquirer, 'prompt')
    const response = await executeBBFlow({
      ...savedActions[2],
      args: {
        yesToAllOnce: true,
        password: '123456',
      },
    })

    expect(spy).not.toHaveBeenCalled()
    expect(response).not.toHaveProperty('args')
  })
})
