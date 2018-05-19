import executeNubankFlow from '../nubank'
import executeBBFlow from '../bb'
import executeYnabFlow from '.'
import { flowTypes } from '../.'

describe('YNAB flow', () => {
  it('should return action object for nubank flow', async () => {
    const { transactions, ...remainingProps } = await executeNubankFlow({ flowType: flowTypes[0] })
    const action = await executeYnabFlow(remainingProps, transactions)

    expect(action).toHaveProperty('username')
    expect(action).toHaveProperty('flowType')
    expect(action).toHaveProperty('budget')
    expect(action).toHaveProperty('budget.id')
    expect(action).toHaveProperty('budget.name')
    expect(action).toHaveProperty('account')
    expect(action).toHaveProperty('account.id')
    expect(action).toHaveProperty('account.name')
  })
  
  it('should return action object for bb flow', async () => {
    const { transactions, ...remainingProps } = await executeBBFlow({ flowType: flowTypes[1] })
    const action = await executeYnabFlow(remainingProps, transactions)
    
    expect(action).toHaveProperty('username')
    expect(action.username).toHaveProperty('branch')
    expect(action.username).toHaveProperty('account')
    expect(action).toHaveProperty('flowType')
    expect(action).toHaveProperty('budget')
    expect(action).toHaveProperty('budget.id')
    expect(action).toHaveProperty('budget.name')
    expect(action).toHaveProperty('account')
    expect(action).toHaveProperty('account.id')
    expect(action).toHaveProperty('account.name')
  })
})
