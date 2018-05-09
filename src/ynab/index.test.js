import executeNubankFlow from '../nubank'
import executeYnabFlow from '.'

describe('YNAB flow', () => {
  it('should return action object', async () => {
    const { username, transactions } = await executeNubankFlow()
    const action = await executeYnabFlow({ username }, transactions)

    expect(action).toHaveProperty('username')
    expect(action).toHaveProperty('budget')
    expect(action).toHaveProperty('budget.id')
    expect(action).toHaveProperty('budget.name')
    expect(action).toHaveProperty('account')
    expect(action).toHaveProperty('account.id')
    expect(action).toHaveProperty('account.name')
  })
})
