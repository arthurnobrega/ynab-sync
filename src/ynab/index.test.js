import executeNubankFlow from '../nubank'
import executeYnabFlow from '.'

describe('YNAB flow', () => {
  it('should return action object', async () => {
    const nubankTransactions = await executeNubankFlow()
    const action = await executeYnabFlow({}, nubankTransactions)

    expect(action).toHaveProperty('budget')
    expect(action).toHaveProperty('budget.id')
    expect(action).toHaveProperty('budget.name')
    expect(action).toHaveProperty('account')
    expect(action).toHaveProperty('account.id')
    expect(action).toHaveProperty('account.name')
  })
})
