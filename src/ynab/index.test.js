import executeNubankFlow from '../nubank'
import executeBBFlow from '../bb'
import executeYnabFlow from '.'

describe('YNAB flow', () => {
  it('should return action object for nubank flow', async () => {
    const { username, transactions } = await executeNubankFlow()
    const action = await executeYnabFlow({ type: 'nubank' }, { username }, transactions)

    expect(action).toHaveProperty('username')
    expect(action).toHaveProperty('budget')
    expect(action).toHaveProperty('budget.id')
    expect(action).toHaveProperty('budget.name')
    expect(action).toHaveProperty('account')
    expect(action).toHaveProperty('account.id')
    expect(action).toHaveProperty('account.name')
  })

  it('should return action object for bb flow', async () => {
    const { username, transactions } = await executeBBFlow()
    const action = await executeYnabFlow({ type: 'bb' }, { username }, transactions)

    expect(action).toHaveProperty('username')
    expect(action.username).toHaveProperty('branch')
    expect(action.username).toHaveProperty('account')
    expect(action).toHaveProperty('budget')
    expect(action).toHaveProperty('budget.id')
    expect(action).toHaveProperty('budget.name')
    expect(action).toHaveProperty('account')
    expect(action).toHaveProperty('account.id')
    expect(action).toHaveProperty('account.name')
  })
})
